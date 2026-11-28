/* Relais Telegram pour « Cours en mouvement » (Cloudflare Worker).
   Secrets (jamais dans le dépôt) : BOT_TOKEN, CHAT_ID.
   Variable : ALLOWED_ORIGIN, par exemple https://itech327.github.io
   Plusieurs origines possibles, séparées par des virgules. L'API enseignant n'accepte que la première.
   Variable facultative : CLASSES, codes de classe acceptés séparés par des virgules (sinon la liste par défaut ci-dessous).

   Protections de l'envoi (rapport F-1 du 17/11/2026) :
   - origine obligatoire : une requête sans en-tête Origin (curl, script) ou d'une autre origine est refusée ;
   - seuls les élèves d'une classe connue sont enregistrés dans la base ; les autres donnent une alerte marquée « غير موثّق » ;
   - limites : 20 messages par minute et par IP, 60 par heure et par session, 30 alertes par minute au total.

   Phase 2 : Cloudflare Turnstile (actif seulement si le secret TURNSTILE_SECRET existe).
   - POST /token avec { t: jeton Turnstile } : le relais vérifie le jeton auprès de Cloudflare et renvoie un laissez-passer
     signé (HMAC, valable 6 heures, lié à l'origine). Rien n'est stocké.
   - Un élève nommé n'est enregistré que si son message porte un laissez-passer valide ; sinon l'alerte Telegram part,
     marquée « غير موثّق », et rien n'est stocké. Les visites anonymes (open) ne demandent rien. */

const MAX_BODY = 4000;
const LIMIT_IP = 20;       // messages par minute et par IP
const LIMIT_ALL = 30;      // alertes Telegram par minute, toutes IP confondues (par instance du Worker)
const DEFAULT_CLASSES = ['1APIC', '2APIC', '3APIC'].reduce((a, n) => a.concat([n, n + '1', n + '2', n + '3']), []);
const LIMIT_SESSION = 60;  // messages par heure et par session
const RETENTION_DAYS = 180;  // durée de conservation des événements dans D1
const PASS_TTL = 6 * 3600 * 1000;  // durée du laissez-passer Turnstile
const LIMIT_TOKEN = 10;    // demandes de laissez-passer par minute et par IP
const hits = new Map();
export function _reset() { hits.clear(); }  // pour les tests

function origins(env) { return String(env.ALLOWED_ORIGIN || '').split(',').map(function (x) { return clean(x.trim(), 200); }).filter(Boolean); }
function clean(v, n) {
  return String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n || 80);
}
function num(v, lo, hi) { v = Number(v); return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : 0; }
function limited(key, max, windowMs, now) {
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= max) { hits.set(key, arr); return true; }
  arr.push(now); hits.set(key, arr);
  if (hits.size > 5000) for (const k of hits.keys()) { hits.delete(k); if (hits.size < 2500) break; }
  return false;
}
export function classes(env) {
  const l = String((env && env.CLASSES) || '').split(',').map(clsClean).filter(Boolean);
  return l.length ? l : DEFAULT_CLASSES;
}
export function clsClean(v) { v = String(v == null ? '' : v).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12); return v.length >= 3 ? v : ''; }

/* ---- Turnstile : laissez-passer signé ---- */
function b64u(buf) { let s = ''; new Uint8Array(buf).forEach((b) => { s += String.fromCharCode(b); }); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function passKey(env) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode('taalim-pass|' + env.TURNSTILE_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}
export async function makePass(env, origin, exp) {
  const sig = await crypto.subtle.sign('HMAC', await passKey(env), new TextEncoder().encode(origin + '|' + exp));
  return exp + '.' + b64u(sig);
}
export async function checkPass(env, origin, pass, now) {
  const m = /^(\d{10,15})\.([\w-]{20,60})$/.exec(String(pass || ''));
  if (!m || Number(m[1]) < now || Number(m[1]) > now + PASS_TTL + 60000) return false;
  const good = await makePass(env, origin, m[1]);
  if (good.length !== pass.length) return false;
  let d = 0; for (let i = 0; i < good.length; i++) d |= good.charCodeAt(i) ^ pass.charCodeAt(i);
  return d === 0;
}
async function token(request, env, origin, cors) {
  const H = Object.assign({ 'Content-Type': 'application/json' }, cors), now = Date.now();
  if (!env.TURNSTILE_SECRET) return new Response('{"error":"off"}', { status: 404, headers: H });
  if (limited('tok:' + (request.headers.get('CF-Connecting-IP') || ''), LIMIT_TOKEN, 60000, now)) return new Response('{"error":"rate"}', { status: 429, headers: H });
  const raw = await request.text();
  if (raw.length > 4096) return new Response('{"error":"size"}', { status: 413, headers: H });
  let t = ''; try { t = String(JSON.parse(raw).t || ''); } catch (_) { /* vide */ }
  if (!t || t.length > 2048) return new Response('{"error":"token"}', { status: 400, headers: H });
  const f = new FormData(); f.append('secret', env.TURNSTILE_SECRET); f.append('response', t);
  const ip = request.headers.get('CF-Connecting-IP'); if (ip) f.append('remoteip', ip);
  let j = {}; try { j = await (await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: f })).json(); } catch (_) { j = {}; }
  if (!j.success || (j.hostname && 'https://' + j.hostname !== origin)) return new Response('{"error":"verify"}', { status: 403, headers: H });
  const exp = now + PASS_TTL;
  return new Response(JSON.stringify({ pass: await makePass(env, origin, exp), exp }), { status: 200, headers: H });
}

/* Événement à stocker pour le tableau de bord : élèves nommés (login, series, end, exit). Le serveur ne l'appelle que pour une classe connue. */
export function toRow(p, now) {
  const type = clean(p.type, 10);
  if (['login', 'series', 'end', 'exit'].indexOf(type) < 0) return null;
  const sid = clean(p.sid, 40).replace(/[^\w-]/g, '');
  if (!sid || !clean(p.name, 60)) return null;
  const d = { };
  if (type === 'series') {
    d.title = clean(p.title, 100); d.d = num(p.d, 0, 4); d.good = num(p.good, 0, 50); d.asked = num(p.asked, 0, 50); d.pct = num(p.pct, 0, 100);
    d.pts = num(p.pts, 0, 500); d.max = num(p.max, 0, 500); d.timeout = !!p.timeout;
  } else if (type === 'login') {
    d.device = clean(p.device, 120); d.city = clean(p.city, 40); d.country = clean(p.country, 40);
  } else {
    d.device = clean(p.device, 120); d.durMs = num(p.durMs, 0, 864e5); d.n = num(p.n, 0, 3000); d.ok = num(p.ok, 0, 3000); d.pct = num(p.pct, 0, 100);
    d.pts = num(p.pts, 0, 99999); d.hints = num(p.hints, 0, 3000);
    d.lv = (Array.isArray(p.lv) ? p.lv : []).slice(0, 4).map((x) => [num(x && x[0], 0, 3000), num(x && x[1], 0, 3000)]);
    d.weak = (Array.isArray(p.weak) ? p.weak : []).slice(0, 5).map((w) => ({ title: clean(w && w.title, 80), pct: num(w && w.pct, 0, 100) }));
  }
  return { ts: now, cls: clsClean(p.cls), sid, type, app: clean(p.page, 40), name: clean(p.name, 60), data: JSON.stringify(d) };
}

async function store(env, row) {
  if (!env.DB || !row) return;
  try {
    await env.DB.prepare('INSERT INTO events (ts, cls, sid, type, app, name, data) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(row.ts, row.cls, row.sid, row.type, row.app, row.name, row.data).run();
    if (Math.random() < 0.02) await env.DB.prepare('DELETE FROM events WHERE ts < ?').bind(row.ts - RETENTION_DAYS * 864e5).run();
  } catch (_) { /* le stockage ne doit jamais bloquer l'alerte */ }
}


/* ---- Jeu « الباب الموالي » : événements ANONYMES (aucun nom), progression de classe, alerte Telegram de classe ----
   POST /api/bab           { chapter, cls, sid, type, door }  → 204. Classe connue obligatoire, sinon 400, rien stocké.
   GET  /api/bab/progress?cls=&chapter=  → { n, donePct:[p0,p1,p2] } ; donePct = null sous BAB_MIN_N appareils.
   Cron quotidien : par classe, chapitre et porte, si BAB_ALERT_MIN appareils ou plus sont bloqués
   (« start » sans « done », dernier « start » > 2 jours, activité < 14 jours), un seul message Telegram, sans nom. */
const BAB_TYPES = ['listen', 'start', 'frag', 'miss', 'key', 'done', 'chest'];
const BAB_LIMIT_IP = 120;     // événements par minute et par IP (une classe entière sort souvent par la même IP)
const BAB_LIMIT_SID = 200;    // événements par heure et par appareil
const BAB_MIN_N = 3;          // pas de pourcentage publié sous 3 appareils
const BAB_ALERT_MIN = 3;      // pas d'alerte sous 3 élèves bloqués
const BAB_STUCK_MS = 2 * 864e5, BAB_ACTIVE_MS = 14 * 864e5;
export function babRow(p, now, env) {
  if (!p || typeof p !== 'object') return null;
  const type = String(p.type || ''), chapter = String(p.chapter || ''), sid = String(p.sid || ''), door = Number(p.door);
  if (BAB_TYPES.indexOf(type) < 0) return null;
  if (!/^[a-z0-9-]{3,40}$/.test(chapter) || !/^[a-z0-9]{6,20}$/.test(sid)) return null;
  if (!Number.isInteger(door) || door < 0 || door > 3) return null;
  const cls = clsClean(p.cls); if (!cls || classes(env).indexOf(cls) < 0) return null;
  return { ts: now, cls, sid, chapter, type, door };
}
function babLog(o) { try { console.log(JSON.stringify(Object.assign({ evt: 'bab' }, o))); } catch (_) { /* rien */ } }
async function bab(request, env, url, cors) {
  const H = Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }, cors);
  const out = (o, st) => new Response(o == null ? null : JSON.stringify(o), { status: st, headers: H });
  if (!env.DB) return out({ error: 'db' }, 503);
  const now = Date.now(), ip = request.headers.get('CF-Connecting-IP') || '';
  if (url.pathname === '/api/bab' && request.method === 'POST') {
    if (limited('bab-ip:' + ip, BAB_LIMIT_IP, 60000, now)) return out({ error: 'rate' }, 429);
    const raw = await request.text(); if (raw.length > 600) return out({ error: 'size' }, 413);
    let p; try { p = JSON.parse(raw); } catch (_) { return out({ error: 'json' }, 400); }
    const row = babRow(p, now, env); if (!row) return out({ error: 'invalid' }, 400);
    if (limited('bab-sid:' + row.sid, BAB_LIMIT_SID, 3600000, now)) return out({ error: 'rate' }, 429);
    try {
      await env.DB.prepare('INSERT INTO bab_events (ts, cls, sid, chapter, type, door) VALUES (?, ?, ?, ?, ?, ?)').bind(row.ts, row.cls, row.sid, row.chapter, row.type, row.door).run();
      if (Math.random() < 0.01) await env.DB.prepare('DELETE FROM bab_events WHERE ts < ?').bind(now - RETENTION_DAYS * 864e5).run();
    } catch (e) { babLog({ op: 'insert', error: String(e && e.message || e).slice(0, 200) }); return out({ error: 'db' }, 503); }
    return out(null, 204);
  }
  if (url.pathname === '/api/bab/progress' && request.method === 'GET') {
    const cls = clsClean(url.searchParams.get('cls')), chapter = String(url.searchParams.get('chapter') || '');
    if (!cls || classes(env).indexOf(cls) < 0 || !/^[a-z0-9-]{3,40}$/.test(chapter)) return out({ error: 'invalid' }, 400);
    if (limited('bab-ip:' + ip, BAB_LIMIT_IP, 60000, now)) return out({ error: 'rate' }, 429);
    try { return out(await babProgress(env, cls, chapter, now), 200); }
    catch (e) { babLog({ op: 'progress', error: String(e && e.message || e).slice(0, 200) }); return out({ error: 'db' }, 503); }
  }
  return out({ error: 'route' }, 404);
}
export async function babProgress(env, cls, chapter, now) {
  const since = now - RETENTION_DAYS * 864e5;
  const { results } = await env.DB.prepare(
    "SELECT COUNT(DISTINCT sid) AS n, COUNT(DISTINCT CASE WHEN type = 'done' AND door = 0 THEN sid END) AS d0, " +
    "COUNT(DISTINCT CASE WHEN type = 'done' AND door = 1 THEN sid END) AS d1, COUNT(DISTINCT CASE WHEN type = 'done' AND door = 2 THEN sid END) AS d2 " +
    'FROM bab_events WHERE cls = ? AND chapter = ? AND ts >= ?').bind(cls, chapter, since).all();
  const r = (results && results[0]) || {}, n = Number(r.n) || 0;
  return { n, donePct: n < BAB_MIN_N ? null : [r.d0, r.d1, r.d2].map((x) => Math.round(100 * (Number(x) || 0) / n)) };
}
export async function babStuck(env, now) {
  const { results } = await env.DB.prepare(
    'SELECT cls, chapter, door, COUNT(*) AS n FROM (' +
    "SELECT cls, chapter, sid, door, MAX(CASE WHEN type = 'start' THEN ts END) AS s, MAX(CASE WHEN type = 'done' THEN 1 ELSE 0 END) AS dn " +
    'FROM bab_events WHERE ts >= ? AND door BETWEEN 0 AND 2 GROUP BY cls, chapter, sid, door' +
    ') WHERE dn = 0 AND s IS NOT NULL AND s < ? GROUP BY cls, chapter, door HAVING COUNT(*) >= ? ORDER BY cls, chapter, door')
    .bind(now - BAB_ACTIVE_MS, now - BAB_STUCK_MS, BAB_ALERT_MIN).all();
  return results || [];
}
export function babAlertText(list) {
  return ['🚪 لعبة «الباب الموالي»: تلاميذ عالقون منذ أكثر من يومين'].concat(list.map((x) =>
    '• القسم ' + clsClean(x.cls) + ' · ' + String(x.chapter).slice(0, 40) + ' · الباب ' + (Number(x.door) + 1) + ': ' + Number(x.n) + ' تلاميذ')).join('\n');
}
export async function babCron(env, now) {
  const t0 = Date.now();
  if (!env.DB || !env.BOT_TOKEN || !env.CHAT_ID) { babLog({ op: 'cron', error: 'config' }); return { sent: 0 }; }
  let list = [];
  try { list = await babStuck(env, now); } catch (e) { babLog({ op: 'cron', error: String(e && e.message || e).slice(0, 200) }); return { sent: 0 }; }
  if (!list.length) { babLog({ op: 'cron', groups: 0, ms: Date.now() - t0 }); return { sent: 0 }; }
  const r = await fetch('https://api.telegram.org/bot' + env.BOT_TOKEN + '/sendMessage', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: env.CHAT_ID, text: babAlertText(list).slice(0, 3900), disable_web_page_preview: true }) }).catch(() => null);
  babLog({ op: 'cron', groups: list.length, telegram: r ? r.status : 'network', ms: Date.now() - t0 });
  return { sent: r && r.ok ? 1 : 0, groups: list.length };
}

const J = (o, status) => new Response(JSON.stringify(o), { status: status || 200, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });

/* API enseignant : protégée par une clé (secret TEACHER_KEY, 12 caractères au moins), jamais écrite dans le dépôt.
   Sans clé configurée, tout est refusé. Après 10 échecs en 10 minutes, l'adresse IP est bloquée. */
function sameKey(a, b) {
  if (a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
async function teacher(request, env, url, cors) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  const withCors = (r) => { Object.keys(cors).forEach((k) => r.headers.set(k, cors[k])); return r; };
  const origin = request.headers.get('Origin') || '';
  if (origin && origin !== (origins(env)[0] || '')) return withCors(J({ error: 'origin' }, 403));
  const key = String(env.TEACHER_KEY || '');
  if (key.length < 12) return withCors(J({ error: 'config' }, 503));
  const ip = request.headers.get('CF-Connecting-IP') || '', now = Date.now(), fk = 'authfail:' + ip;
  const fails = (hits.get(fk) || []).filter((t) => now - t < 600000);
  if (fails.length >= 10) return withCors(J({ error: 'rate' }, 429));
  const m = /^Bearer (.+)$/.exec(request.headers.get('Authorization') || '');
  if (!m || !sameKey(m[1], key)) { fails.push(now); hits.set(fk, fails); return withCors(J({ error: 'auth' }, 401)); }
  return withCors(await teacherApi(request, env, url));
}
async function teacherApi(request, env, url) {
  if (!env.DB) return J({ error: 'db' }, 503);
  const path = url.pathname;
  if (request.method === 'GET' && path === '/api/teacher/events') {
    const cls = clsClean(url.searchParams.get('cls')), days = num(url.searchParams.get('days') || 30, 1, RETENTION_DAYS) || 30;
    const since = Date.now() - days * 864e5;
    const st = cls
      ? env.DB.prepare('SELECT id, ts, cls, sid, type, app, name, data FROM events WHERE ts >= ? AND cls = ? ORDER BY ts DESC LIMIT 2000').bind(since, cls)
      : env.DB.prepare('SELECT id, ts, cls, sid, type, app, name, data FROM events WHERE ts >= ? ORDER BY ts DESC LIMIT 2000').bind(since);
    const { results } = await st.all();
    const cl = await env.DB.prepare('SELECT cls, COUNT(DISTINCT sid) AS n FROM events WHERE ts >= ? GROUP BY cls ORDER BY n DESC').bind(since).all();
    return J({ now: Date.now(), classes: cl.results || [], events: (results || []).map((r) => Object.assign({}, r, { data: safeJson(r.data) })) });
  }
  if (request.method === 'POST' && path === '/api/teacher/delete') {
    let b; try { b = JSON.parse(await request.text()); } catch (_) { return J({ error: 'json' }, 400); }
    const sid = clean(b && b.sid, 40).replace(/[^\w-]/g, '');
    if (!sid) return J({ error: 'sid' }, 400);
    const r = await env.DB.prepare('DELETE FROM events WHERE sid = ?').bind(sid).run();
    return J({ ok: true, deleted: (r.meta && r.meta.changes) || 0 });
  }
  return J({ error: 'route' }, 404);
}
function safeJson(t) { try { return JSON.parse(t); } catch (_) { return {}; } }

function dur(ms) { const s = Math.round(ms / 1000), m = Math.floor(s / 60); return m ? m + ' min ' + (s % 60) + ' s' : s + ' s'; }

export function format(p, cf, ip) {
  const type = clean(p.type, 10), page = clean(p.page, 40), name = clean(p.name, 60);
  const lv = ['سهل', 'متوسط', 'صعب', 'تحدّي'];
  const place = (c) => [clean(c.city, 40), clean(c.region, 40), clean(c.country, 40)].filter(Boolean).join('، ');
  if (type === 'open') return '👀 فتح صفحة\n' + page + (name ? '\nالاسم: ' + name : '\n(زائر مجهول)') + (cf && cf.country ? '\nالبلد: ' + clean(cf.country, 10) : '');
  const who = () => {
    const seen = [place(p) && 'المدينة: ' + place(p) + (p.cityApprox ? ' (تقريبية)' : '')].filter(Boolean);
    return ['الاسم: ' + name, 'الجهاز: ' + clean(p.device, 120)].concat(clsClean(p.cls) ? ['القسم: ' + clsClean(p.cls)] : [], seen);
  };
  if (type === 'login') {
    const obs = [];
    if (p.consent && cf && cf.city) obs.push('المدينة (من الخادم): ' + clean(cf.city, 40) + (cf.country ? '، ' + clean(cf.country, 10) : ''));
    return ['🔐 دخول جلسة', page].concat(who(), obs).join('\n');
  }
  if (type === 'series') {
    const d = num(p.d, 0, 4);
    return ['📝 إتمام سلسلة تمارين', page, 'الاسم: ' + name, 'الفصل: ' + clean(p.title, 100), 'المستوى: ' + (d ? lv[d - 1] : 'تكيّفي') + (p.timeout ? ' (انتهى الوقت)' : ''), 'النتيجة: ' + num(p.good, 0, 50) + '/' + num(p.asked, 0, 50) + ' (' + num(p.pct, 0, 100) + '%)', 'النقاط: ' + num(p.pts, 0, 500) + '/' + num(p.max, 0, 500)].join('\n');
  }
  if (type === 'end' || type === 'exit') {
    const head = type === 'end' ? '🏁 نهاية الجلسة مع النتائج' : '🚪 خروج من الموقع';
    const levels = (Array.isArray(p.lv) ? p.lv : []).slice(0, 4).map((x, i) => lv[i] + ': ' + num(x && x[0], 0, 3000) + '/' + num(x && x[1], 0, 3000)).join(' | ');
    const weak = (Array.isArray(p.weak) ? p.weak : []).slice(0, 5).map((w) => '• ' + clean(w.title, 80) + ' ' + num(w.pct, 0, 100) + '%').join('\n');
    return [head, page].concat(who(), ['المدة: ' + dur(num(p.durMs, 0, 864e5)), 'الأسئلة: ' + num(p.ok, 0, 3000) + '/' + num(p.n, 0, 3000) + ' (' + num(p.pct, 0, 100) + '%)', 'النقاط: ' + num(p.pts, 0, 99999) + ' | التلميحات: ' + num(p.hints, 0, 3000), levels], weak ? ['فصول للمراجعة:', weak] : []).filter(Boolean).join('\n');
  }
  return '';
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const list = origins(env), allowed0 = list[0] || '';
    if (url.pathname.indexOf('/api/teacher/') === 0) return teacher(request, env, url, { 'Access-Control-Allow-Origin': allowed0 || 'null', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Vary': 'Origin' });
    const origin = request.headers.get('Origin') || '';
    const allowed = (origin && list.indexOf(origin) >= 0) ? origin : allowed0;
    const cors = { 'Access-Control-Allow-Origin': allowed || 'null', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' };
    if (url.pathname === '/api/bab' || url.pathname === '/api/bab/progress') {
      cors['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
      if (!origin || list.indexOf(origin) < 0) return new Response('origin', { status: 403, headers: cors });
      return bab(request, env, url, cors);
    }
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return new Response('method', { status: 405, headers: cors });
    if (!origin || list.indexOf(origin) < 0) return new Response('origin', { status: 403, headers: cors });
    if (url.pathname === '/token') return token(request, env, origin, cors);
    if (!env.BOT_TOKEN || !env.CHAT_ID) return new Response('config', { status: 500, headers: cors });
    const raw = await request.text();
    if (raw.length > MAX_BODY) return new Response('size', { status: 413, headers: cors });
    let p; try { p = JSON.parse(raw); } catch (_) { return new Response('json', { status: 400, headers: cors }); }
    if (!p || typeof p !== 'object') return new Response('json', { status: 400, headers: cors });
    const ip = request.headers.get('CF-Connecting-IP') || '', now = Date.now();
    if (limited('ip:' + ip, LIMIT_IP, 60000, now)) return new Response('rate', { status: 429, headers: cors });
    const sid = clean(p.sid, 40);
    if (sid && limited('sid:' + sid, LIMIT_SESSION, 3600000, now)) return new Response('rate', { status: 429, headers: cors });
    let text = format(p, request.cf, ip);
    if (!text) return new Response('type', { status: 400, headers: cors });
    const named = ['login', 'series', 'end', 'exit'].indexOf(clean(p.type, 10)) >= 0 && clean(p.name, 60);
    const known = classes(env).indexOf(clsClean(p.cls)) >= 0;
    const human = !env.TURNSTILE_SECRET || !named || await checkPass(env, origin, p.pass, now);
    if (named && !known) text = '⚠️ غير موثّق: قسم غير معروف (' + (clsClean(p.cls) || 'بدون قسم') + ')\n' + text;
    else if (named && !human) text = '⚠️ غير موثّق: تحقق Turnstile غير صالح\n' + text;
    if (limited('all', LIMIT_ALL, 60000, now)) return new Response('rate', { status: 429, headers: cors });
    if (named && known && human) await store(env, toRow(p, now));
    const r = await fetch('https://api.telegram.org/bot' + env.BOT_TOKEN + '/sendMessage', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text: text.slice(0, 3900), disable_web_page_preview: true })
    });
    return new Response(r.ok ? 'ok' : 'telegram', { status: r.ok ? 200 : 502, headers: cors });
  },
  async scheduled(event, env, ctx) { ctx.waitUntil(babCron(env, Date.now())); }
};