import type { DialectCode } from '../dialects';
import { countChars, countWords, estimateSeconds, FREE_REGEN_MAX_WORDS, MAX_CHARS_PER_REQUEST } from '../text';
import type { Balance, Generation, Result, User, Voice, VoiceStyle } from '../types';
import type { DataLayer } from './layer';
import { seedVoices } from './voices';

// DataLayer on Cloudflare D1 (SQLite) with audio in Workers KV.
// Schema: app/migrations/0001_init.sql. Same rules as the in-memory layer.
// Only Web APIs (crypto.subtle, getRandomValues), so it runs on Workers and in Node.
// Spending is safe under concurrency: each reserve or release is one D1 batch (atomic),
// and a CHECK keeps seconds_left >= 0, so a racing spend makes the batch fail.

// The few D1 and KV methods we use, so the app needs no Workers type package.
export interface D1Stmt {
  bind(...values: unknown[]): D1Stmt;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<{ meta: { changes?: number } }>;
}
export interface D1Like {
  prepare(sql: string): D1Stmt;
  batch(statements: D1Stmt[]): Promise<unknown[]>;
}
export interface KVLike {
  get(key: string, type: 'arrayBuffer'): Promise<ArrayBuffer | null>;
  put(key: string, value: ArrayBuffer | Uint8Array, options?: { expirationTtl?: number; metadata?: unknown }): Promise<void>;
  delete(key: string): Promise<void>;
}

const DAY = 864e5;
const SESSION_TTL = 30 * DAY;
const AUDIO_TTL = 7 * DAY;
const PBKDF2_ITER = 600_000; // OWASP guidance for PBKDF2-HMAC-SHA256

const enc = new TextEncoder();
const hex = (b: ArrayBuffer | Uint8Array) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
const fromHex = (h: string): Uint8Array<ArrayBuffer> => new Uint8Array(h.match(/../g)!.map((x) => parseInt(x, 16)));
const sha256 = async (s: string) => hex(await crypto.subtle.digest('SHA-256', enc.encode(s)));
const randomToken = () => {
  const b = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const fail = <T>(code: Extract<Result<T>, { ok: false }>['code'], error: string): Result<T> => ({ ok: false, code, error });

async function pbkdf2(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256));
}
async function hashPass(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${PBKDF2_ITER}$${hex(salt)}$${hex(await pbkdf2(password, salt, PBKDF2_ITER))}`;
}
async function checkPass(password: string, stored: string): Promise<boolean> {
  const [algo, iter, salt, h] = stored.split('$');
  if (algo !== 'pbkdf2' || !iter || !salt || !h) return false;
  const got = await pbkdf2(password, fromHex(salt), Number(iter));
  const want = fromHex(h);
  if (got.length !== want.length) return false;
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got[i] ^ want[i];
  return diff === 0;
}

interface UserRow { id: string; email: string; display_name: string | null; created_at: number; pass_hash: string }
interface LotRow { id: string; seconds_left: number; expires_at: number | null; created_at: number }
interface GenRow {
  id: string; user_id: string; kind: 'tts' | 'sfx'; voice_id: string | null; dialect: string | null; input_text: string;
  char_count: number; word_count: number; status: 'queued' | 'done' | 'failed'; seconds_reserved: number;
  seconds_charged: number | null; error: string | null; regenerated_from: string | null; is_free_regen: number;
  style: string | null; delivery: string | null; pace: string | null; register: string | null; audio_mime: string | null;
  expires_at: number; created_at: number;
}

const toUser = (r: UserRow): User => ({ id: r.id, email: r.email, displayName: r.display_name, createdAt: new Date(r.created_at).toISOString() });
const toGen = (r: GenRow): Generation => ({
  id: r.id, userId: r.user_id, kind: r.kind, voiceId: r.voice_id, dialect: r.dialect as DialectCode | null, inputText: r.input_text,
  charCount: r.char_count, wordCount: r.word_count, status: r.expires_at < Date.now() ? 'expired' : r.status,
  secondsReserved: r.seconds_reserved, secondsCharged: r.seconds_charged, error: r.error, regeneratedFrom: r.regenerated_from,
  style: r.style as VoiceStyle | null, delivery: r.delivery, pace: r.pace, register: r.register, isFreeRegen: r.is_free_regen === 1,
  expiresAt: new Date(r.expires_at).toISOString(), createdAt: new Date(r.created_at).toISOString(),
});

export function d1Data(db: D1Like, kv: KVLike, voices: Voice[] = seedVoices()): DataLayer {
  const liveLots = (userId: string, now: number) => db.prepare(
    `SELECT id, seconds_left, expires_at, created_at FROM credit_lots
     WHERE user_id = ? AND seconds_left > 0 AND (expires_at IS NULL OR expires_at > ?)
     ORDER BY expires_at IS NULL, expires_at, created_at`).bind(userId, now).all<LotRow>();
  const hasPurchase = async (userId: string, liveOnly: boolean) => !!(await db.prepare(
    `SELECT 1 AS x FROM credit_lots WHERE user_id = ? AND source = 'purchase'${liveOnly ? ' AND seconds_left > 0 AND (expires_at IS NULL OR expires_at > ?)' : ''} LIMIT 1`)
    .bind(...(liveOnly ? [userId, Date.now()] : [userId])).first());

  // Give back unused seconds of a generation, to the latest-expiring lots first.
  async function releaseStatements(generationId: string, seconds: number, now: number): Promise<D1Stmt[]> {
    if (seconds <= 0) return [];
    const { results } = await db.prepare(
      `SELECT l.id, l.user_id, l.expires_at, -SUM(g.delta) AS taken FROM credit_ledger g JOIN credit_lots l ON l.id = g.lot_id
       WHERE g.generation_id = ? GROUP BY l.id HAVING taken > 0 ORDER BY l.expires_at IS NULL DESC, l.expires_at DESC`)
      .bind(generationId).all<{ id: string; user_id: string; taken: number }>();
    const out: D1Stmt[] = [];
    let need = seconds;
    for (const r of results) {
      if (!need) break;
      const give = Math.min(r.taken, need);
      need -= give;
      out.push(db.prepare('UPDATE credit_lots SET seconds_left = seconds_left + ? WHERE id = ?').bind(give, r.id));
      out.push(db.prepare('INSERT INTO credit_ledger (user_id, lot_id, generation_id, delta, created_at) VALUES (?, ?, ?, ?, ?)')
        .bind(r.user_id, r.id, generationId, give, now));
    }
    return out;
  }

  const layer: DataLayer = {
    async createUser(email, password) {
      const e = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return fail('invalid', 'البريد الإلكتروني غير صالح');
      if (password.length < 8) return fail('invalid', 'كلمة المرور قصيرة، ٨ أحرف على الأقل');
      if (await db.prepare('SELECT 1 AS x FROM users WHERE email = ?').bind(e).first()) return fail('conflict', 'هذا البريد مسجّل من قبل');
      const row: UserRow = { id: crypto.randomUUID(), email: e, display_name: null, created_at: Date.now(), pass_hash: await hashPass(password) };
      try {
        await db.prepare('INSERT INTO users (id, email, pass_hash, display_name, created_at) VALUES (?, ?, ?, ?, ?)')
          .bind(row.id, row.email, row.pass_hash, null, row.created_at).run();
      } catch {
        return fail('conflict', 'هذا البريد مسجّل من قبل'); // lost a race on the UNIQUE email
      }
      return { ok: true, value: toUser(row) };
    },
    async verifyUser(email, password) {
      const u = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email.trim().toLowerCase()).first<UserRow>();
      if (!u || !(await checkPass(password, u.pass_hash))) return fail('forbidden', 'البريد أو كلمة المرور غير صحيحة');
      return { ok: true, value: toUser(u) };
    },
    async getUser(id) {
      const u = await db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first<UserRow>();
      return u ? toUser(u) : null;
    },
    async deleteUser(id) {
      const { results } = await db.prepare('SELECT id FROM generations WHERE user_id = ?').bind(id).all<{ id: string }>();
      await Promise.all(results.map((r) => kv.delete(`audio/${r.id}`)));
      // ON DELETE CASCADE removes sessions, lots, ledger and generations. trial_claims stays.
      await db.batch([
        db.prepare('DELETE FROM credit_ledger WHERE user_id = ?').bind(id),
        db.prepare('DELETE FROM generations WHERE user_id = ?').bind(id),
        db.prepare('DELETE FROM credit_lots WHERE user_id = ?').bind(id),
        db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(id),
        db.prepare('DELETE FROM users WHERE id = ?').bind(id),
      ]);
    },
    async createSession(userId) {
      const token = randomToken();
      await db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
        .bind(await sha256(token), userId, Date.now() + SESSION_TTL).run();
      return token;
    },
    async userForSession(token) {
      const u = await db.prepare(
        'SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?')
        .bind(await sha256(token), Date.now()).first<UserRow>();
      return u ? toUser(u) : null;
    },
    async endSession(token) {
      await db.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run();
    },

    async claimTrial(userId) {
      const u = await layer.getUser(userId);
      if (!u) return false;
      const now = Date.now();
      // INSERT OR IGNORE: only the first claim for this email inserts a row.
      const r = await db.prepare('INSERT OR IGNORE INTO trial_claims (email_hash, claimed_at) VALUES (?, ?)')
        .bind(await sha256(u.email.trim().toLowerCase()), now).run();
      if (!r.meta.changes) return false;
      await layer.grantSeconds(userId, 60, 'trial', null);
      return true;
    },

    async getBalance(userId): Promise<Balance> {
      const r = await db.prepare(
        `SELECT COALESCE(SUM(seconds_left), 0) AS left, MIN(expires_at) AS next FROM credit_lots
         WHERE user_id = ? AND seconds_left > 0 AND (expires_at IS NULL OR expires_at > ?)`)
        .bind(userId, Date.now()).first<{ left: number; next: number | null }>();
      return { secondsLeft: r?.left ?? 0, nextExpiry: r?.next ? new Date(r.next).toISOString() : null };
    },
    async grantSeconds(userId, seconds, source, expiresAt) {
      await db.prepare('INSERT INTO credit_lots (id, user_id, source, seconds_total, seconds_left, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(crypto.randomUUID(), userId, source, seconds, seconds, expiresAt ? expiresAt.getTime() : null, Date.now()).run();
    },

    async listVoices({ dialect, userId }) {
      return voices.filter((v) => (!dialect || v.dialect === dialect) && (v.ownerId === null || v.ownerId === userId));
    },
    async getVoice(id) { return voices.find((v) => v.id === id) ?? null; },

    async createGeneration({ userId, voiceId, dialect, text, regeneratedFrom, style, delivery, pace, register }) {
      const voice = voices.find((v) => v.id === voiceId && (v.ownerId === null || v.ownerId === userId));
      if (!voice) return fail('not_found', 'الصوت غير موجود');
      if (voice.dialect !== dialect) return fail('invalid', 'الصوت لا يطابق اللهجة المختارة');
      const chars = countChars(text);
      if (chars === 0) return fail('invalid', 'اكتب نصاً أولاً');
      if (chars > MAX_CHARS_PER_REQUEST) return fail('invalid', `النص أطول من ${MAX_CHARS_PER_REQUEST} حرف`);
      if (voice.isPremium && !(await hasPurchase(userId, false))) return fail('forbidden', 'هذا الصوت متاح في الباقات المدفوعة');

      const g = {
        style: style && voice.styles?.includes(style) ? style : null, delivery: delivery ?? null, pace: pace ?? null,
        register: voice.steerable ? register ?? null : null,
      };
      let isFreeRegen = false;
      if (regeneratedFrom) {
        const orig = await db.prepare('SELECT * FROM generations WHERE id = ? AND user_id = ?').bind(regeneratedFrom, userId).first<GenRow>();
        if (!orig) return fail('not_found', 'الإنشاء الأصلي غير موجود');
        const same = orig.input_text === text && orig.voice_id === voiceId && orig.dialect === dialect && orig.style === g.style
          && orig.delivery === g.delivery && orig.pace === g.pace && orig.register === g.register;
        const used = !!(await db.prepare('SELECT 1 AS x FROM generations WHERE regenerated_from = ? AND is_free_regen = 1').bind(regeneratedFrom).first());
        isFreeRegen = same && !used && countWords(text) <= FREE_REGEN_MAX_WORDS && (await hasPurchase(userId, true));
      }

      const now = Date.now();
      const id = crypto.randomUUID();
      const need = isFreeRegen ? 0 : estimateSeconds(text);
      const insert = db.prepare(
        `INSERT INTO generations (id, user_id, kind, voice_id, dialect, input_text, char_count, word_count, status, seconds_reserved,
           regenerated_from, is_free_regen, style, delivery, pace, register, expires_at, created_at)
         VALUES (?, ?, 'tts', ?, ?, ?, ?, ?, 'queued', ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .bind(id, userId, voiceId, dialect, text, chars, countWords(text), need, regeneratedFrom ?? null, isFreeRegen ? 1 : 0,
          g.style, g.delivery, g.pace, g.register, now + AUDIO_TTL, now);

      // Reserve: soonest-expiring lots first, all in one atomic batch.
      const stmts: D1Stmt[] = [insert];
      if (need > 0) {
        const { results: lots } = await liveLots(userId, now);
        if (lots.reduce((s, l) => s + l.seconds_left, 0) < need) return fail('insufficient_credits', 'رصيدك لا يكفي لهذا النص');
        let left = need;
        for (const l of lots) {
          if (!left) break;
          const take = Math.min(l.seconds_left, left);
          left -= take;
          stmts.push(db.prepare('UPDATE credit_lots SET seconds_left = seconds_left - ? WHERE id = ?').bind(take, l.id));
          stmts.push(db.prepare('INSERT INTO credit_ledger (user_id, lot_id, generation_id, delta, created_at) VALUES (?, ?, ?, ?, ?)')
            .bind(userId, l.id, id, -take, now));
        }
      }
      try {
        await db.batch(stmts);
      } catch (e) {
        const msg = String(e);
        if (/CHECK/i.test(msg)) return fail('insufficient_credits', 'رصيدك لا يكفي لهذا النص'); // a concurrent spend won
        if (/UNIQUE/i.test(msg)) return fail('conflict', 'استُعملت إعادة الإنشاء المجانية من قبل');
        throw e;
      }
      const row = await db.prepare('SELECT * FROM generations WHERE id = ?').bind(id).first<GenRow>();
      return { ok: true, value: toGen(row!) };
    },
    async getGeneration(id, userId) {
      const r = await db.prepare('SELECT * FROM generations WHERE id = ? AND user_id = ?').bind(id, userId).first<GenRow>();
      return r ? toGen(r) : null;
    },
    async listGenerations(userId, limit = 50) {
      const { results } = await db.prepare('SELECT * FROM generations WHERE user_id = ? ORDER BY created_at DESC LIMIT ?')
        .bind(userId, Math.min(Math.max(1, limit), 200)).all<GenRow>();
      return results.map(toGen);
    },
    async completeGeneration(id, audio, mime, seconds) {
      const x = await db.prepare('SELECT * FROM generations WHERE id = ?').bind(id).first<GenRow>();
      if (!x || x.status !== 'queued') return;
      const now = Date.now();
      const charged = x.is_free_regen ? 0 : Math.min(seconds, x.seconds_reserved);
      await kv.put(`audio/${id}`, audio, { expirationTtl: Math.max(60, Math.ceil((x.expires_at - now) / 1000)) });
      await db.batch([
        ...(await releaseStatements(id, x.seconds_reserved - charged, now)),
        db.prepare("UPDATE generations SET status = 'done', seconds_charged = ?, audio_mime = ? WHERE id = ?").bind(charged, mime, id),
      ]);
    },
    async failGeneration(id, error) {
      const x = await db.prepare('SELECT * FROM generations WHERE id = ?').bind(id).first<GenRow>();
      if (!x || x.status !== 'queued') return;
      await db.batch([
        ...(await releaseStatements(id, x.seconds_reserved, Date.now())),
        db.prepare("UPDATE generations SET status = 'failed', error = ?, seconds_charged = 0 WHERE id = ?").bind(error.slice(0, 500), id),
      ]);
    },
    async getAudio(id, userId) {
      const x = await db.prepare('SELECT audio_mime, expires_at FROM generations WHERE id = ? AND user_id = ?').bind(id, userId)
        .first<{ audio_mime: string | null; expires_at: number }>();
      if (!x || !x.audio_mime || x.expires_at < Date.now()) return null;
      const buf = await kv.get(`audio/${id}`, 'arrayBuffer');
      return buf ? { audio: new Uint8Array(buf), mime: x.audio_mime } : null;
    },
  };
  return layer;
}
