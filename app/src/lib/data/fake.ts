import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { DIALECTS, type DialectCode } from '../dialects';
import { countChars, countWords, estimateSeconds, FREE_REGEN_MAX_WORDS, MAX_CHARS_PER_REQUEST } from '../text';
import type { Balance, Generation, Result, UseCase, User, Voice } from '../types';
import type { DataLayer } from './layer';

// In-memory data layer for building screens before the backend exists.
// Same rules as replica/schema.sql: credit lots spent soonest-expiring first,
// reserve before synthesis, release the unused part, one free regeneration.
// Data is lost when the server restarts.

interface Lot { id: string; userId: string; source: 'trial' | 'purchase'; total: number; left: number; expiresAt: Date | null; createdAt: number }
interface StoredUser extends User { passHash: string }
interface Store {
  users: Map<string, StoredUser>;
  sessions: Map<string, string>;
  trialClaims: Set<string>;
  lots: Lot[];
  ledger: { userId: string; lotId: string; generationId: string; delta: number }[];
  voices: Voice[];
  generations: Map<string, Generation>;
  audio: Map<string, { audio: Uint8Array; mime: string }>;
}

const FEMALE = ['ليلى', 'هدى', 'سارة', 'رانية', 'دينا', 'زينب', 'سلوى', 'ريم', 'إيمان', 'لمياء'];
const MALE = ['كريم', 'طارق', 'عمر', 'زياد', 'أنس', 'بلال', 'هشام', 'إدريس', 'سامي', 'نبيل'];
const USES: UseCase[] = ['ads', 'stories', 'documentary', 'education', 'podcast', 'dialogue'];

function seedVoices(): Voice[] {
  const out: Voice[] = [];
  DIALECTS.forEach((d, di) => {
    for (let i = 0; i < 4; i++) {
      const female = i % 2 === 0;
      const pool = female ? FEMALE : MALE;
      out.push({
        id: `v-${d.code}-${i}`,
        name: pool[(di * 2 + i) % pool.length],
        dialect: d.code,
        gender: female ? 'female' : 'male',
        useCase: USES[(di + i) % USES.length],
        isPremium: i >= 2,
        ownerId: null,
      });
    }
  });
  return out;
}

const g = globalThis as unknown as { __fakeStore?: Store };
const db: Store = (g.__fakeStore ??= {
  users: new Map(), sessions: new Map(), trialClaims: new Set(), lots: [], ledger: [],
  voices: seedVoices(), generations: new Map(), audio: new Map(),
});

const hashPass = (p: string, salt = randomBytes(16).toString('hex')) => `${salt}:${scryptSync(p, salt, 32).toString('hex')}`;
const checkPass = (p: string, stored: string) => {
  const [salt, h] = stored.split(':');
  const a = Buffer.from(h, 'hex'); const b = scryptSync(p, salt, 32);
  return a.length === b.length && timingSafeEqual(a, b);
};
const emailHash = (e: string) => createHash('sha256').update(e.trim().toLowerCase()).digest('hex');
const live = (l: Lot) => l.left > 0 && (!l.expiresAt || l.expiresAt.getTime() > Date.now());
const fail = <T>(code: Extract<Result<T>, { ok: false }>['code'], error: string): Result<T> => ({ ok: false, code, error });
const publicUser = ({ passHash: _p, ...u }: StoredUser): User => u;

function reserve(userId: string, generationId: string, seconds: number): boolean {
  const lots = db.lots.filter((l) => l.userId === userId && live(l))
    .sort((a, b) => (a.expiresAt?.getTime() ?? Infinity) - (b.expiresAt?.getTime() ?? Infinity) || a.createdAt - b.createdAt);
  if (lots.reduce((s, l) => s + l.left, 0) < seconds) return false;
  let need = seconds;
  for (const l of lots) {
    if (!need) break;
    const take = Math.min(l.left, need);
    l.left -= take; need -= take;
    db.ledger.push({ userId, lotId: l.id, generationId, delta: -take });
  }
  return true;
}

function release(generationId: string, seconds: number) {
  const taken = new Map<string, number>();
  for (const e of db.ledger.filter((e) => e.generationId === generationId)) taken.set(e.lotId, (taken.get(e.lotId) ?? 0) - e.delta);
  const lots = [...taken.entries()].filter(([, t]) => t > 0)
    .map(([id, t]) => ({ lot: db.lots.find((l) => l.id === id)!, t }))
    .sort((a, b) => (b.lot.expiresAt?.getTime() ?? Infinity) - (a.lot.expiresAt?.getTime() ?? Infinity));
  let need = seconds;
  for (const { lot, t } of lots) {
    if (!need) break;
    const give = Math.min(t, need);
    lot.left += give; need -= give;
    db.ledger.push({ userId: lot.userId, lotId: lot.id, generationId, delta: give });
  }
}

export const fakeData: DataLayer = {
  async createUser(email, password) {
    const e = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return fail('invalid', 'البريد الإلكتروني غير صالح');
    if (password.length < 8) return fail('invalid', 'كلمة المرور قصيرة، ٨ أحرف على الأقل');
    if ([...db.users.values()].some((u) => u.email === e)) return fail('conflict', 'هذا البريد مسجّل من قبل');
    const u: StoredUser = { id: randomUUID(), email: e, displayName: null, createdAt: new Date().toISOString(), passHash: hashPass(password) };
    db.users.set(u.id, u);
    return { ok: true, value: publicUser(u) };
  },
  async verifyUser(email, password) {
    const u = [...db.users.values()].find((x) => x.email === email.trim().toLowerCase());
    if (!u || !checkPass(password, u.passHash)) return fail('forbidden', 'البريد أو كلمة المرور غير صحيحة');
    return { ok: true, value: publicUser(u) };
  },
  async getUser(id) { const u = db.users.get(id); return u ? publicUser(u) : null; },
  async deleteUser(id) {
    db.users.delete(id);
    for (const [t, uid] of db.sessions) if (uid === id) db.sessions.delete(t);
    db.lots = db.lots.filter((l) => l.userId !== id);
    db.ledger = db.ledger.filter((l) => l.userId !== id);
    for (const [gid, gen] of db.generations) if (gen.userId === id) { db.generations.delete(gid); db.audio.delete(gid); }
    db.voices = db.voices.filter((v) => v.ownerId !== id);
    // trialClaims is kept on purpose: no second free minute for the same email
  },
  async createSession(userId) { const t = randomBytes(24).toString('base64url'); db.sessions.set(t, userId); return t; },
  async userForSession(token) { const id = db.sessions.get(token); return id ? this.getUser(id) : null; },
  async endSession(token) { db.sessions.delete(token); },

  async claimTrial(userId) {
    const u = db.users.get(userId); if (!u) return false;
    const h = emailHash(u.email);
    if (db.trialClaims.has(h)) return false;
    db.trialClaims.add(h);
    await this.grantSeconds(userId, 60, 'trial', null);
    return true;
  },

  async getBalance(userId): Promise<Balance> {
    const lots = db.lots.filter((l) => l.userId === userId && live(l));
    const exp = lots.map((l) => l.expiresAt).filter((d): d is Date => !!d).sort((a, b) => a.getTime() - b.getTime());
    return { secondsLeft: lots.reduce((s, l) => s + l.left, 0), nextExpiry: exp[0]?.toISOString() ?? null };
  },
  async grantSeconds(userId, seconds, source, expiresAt) {
    db.lots.push({ id: randomUUID(), userId, source, total: seconds, left: seconds, expiresAt, createdAt: Date.now() });
  },

  async listVoices({ dialect, userId }) {
    return db.voices.filter((v) => (!dialect || v.dialect === dialect) && (v.ownerId === null || v.ownerId === userId));
  },
  async getVoice(id) { return db.voices.find((v) => v.id === id) ?? null; },

  async createGeneration({ userId, voiceId, dialect, text, regeneratedFrom }) {
    const voice = db.voices.find((v) => v.id === voiceId && (v.ownerId === null || v.ownerId === userId));
    if (!voice) return fail('not_found', 'الصوت غير موجود');
    if (voice.dialect !== dialect) return fail('invalid', 'الصوت لا يطابق اللهجة المختارة');
    const chars = countChars(text);
    if (chars === 0) return fail('invalid', 'اكتب نصاً أولاً');
    if (chars > MAX_CHARS_PER_REQUEST) return fail('invalid', `النص أطول من ${MAX_CHARS_PER_REQUEST} حرف`);
    if (voice.isPremium && !db.lots.some((l) => l.userId === userId && l.source === 'purchase'))
      return fail('forbidden', 'هذا الصوت متاح في الباقات المدفوعة');

    let isFreeRegen = false;
    if (regeneratedFrom) {
      const orig = db.generations.get(regeneratedFrom);
      if (!orig || orig.userId !== userId) return fail('not_found', 'الإنشاء الأصلي غير موجود');
      const same = orig.inputText === text && orig.voiceId === voiceId && orig.dialect === dialect;
      const used = [...db.generations.values()].some((x) => x.regeneratedFrom === regeneratedFrom && x.isFreeRegen);
      const subscriber = db.lots.some((l) => l.userId === userId && l.source === 'purchase' && live(l));
      isFreeRegen = same && !used && subscriber && countWords(text) <= FREE_REGEN_MAX_WORDS;
    }

    const now = new Date();
    const gen: Generation = {
      id: randomUUID(), userId, kind: 'tts', voiceId, dialect, inputText: text, charCount: chars, wordCount: countWords(text),
      status: 'queued', secondsReserved: 0, secondsCharged: null, error: null, regeneratedFrom: regeneratedFrom ?? null,
      isFreeRegen, expiresAt: new Date(now.getTime() + 7 * 864e5).toISOString(), createdAt: now.toISOString(),
    };
    const need = isFreeRegen ? 0 : estimateSeconds(text);
    if (need > 0 && !reserve(userId, gen.id, need)) return fail('insufficient_credits', 'رصيدك لا يكفي لهذا النص');
    gen.secondsReserved = need;
    db.generations.set(gen.id, gen);
    return { ok: true, value: gen };
  },
  async getGeneration(id, userId) { const x = db.generations.get(id); return x && x.userId === userId ? x : null; },
  async listGenerations(userId, limit = 50) {
    return [...db.generations.values()].filter((x) => x.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit)
      .map((x) => (new Date(x.expiresAt).getTime() < Date.now() ? { ...x, status: 'expired' as const } : x));
  },
  async completeGeneration(id, audio, mime, seconds) {
    const x = db.generations.get(id); if (!x) return;
    const charged = x.isFreeRegen ? 0 : Math.min(seconds, x.secondsReserved);
    if (x.secondsReserved > charged) release(id, x.secondsReserved - charged);
    Object.assign(x, { status: 'done', secondsCharged: charged });
    db.audio.set(id, { audio, mime });
  },
  async failGeneration(id, error) {
    const x = db.generations.get(id); if (!x) return;
    if (x.secondsReserved > 0) release(id, x.secondsReserved);
    Object.assign(x, { status: 'failed', error, secondsCharged: 0 });
  },
  async getAudio(id, userId) {
    const x = db.generations.get(id);
    if (!x || x.userId !== userId || new Date(x.expiresAt).getTime() < Date.now()) return null;
    return db.audio.get(id) ?? null;
  },
};

export type { DialectCode };
