/* Relais Telegram pour « Cours en mouvement » (Cloudflare Worker).
   Secrets (jamais dans le dépôt) : BOT_TOKEN, CHAT_ID.
   Variable : ALLOWED_ORIGIN, par exemple https://itech327.github.io */

const MAX_BODY = 4000;
const LIMIT_IP = 40;       // messages par minute et par IP
const LIMIT_SESSION = 60;  // messages par heure et par session
const RETENTION_DAYS = 180;  // durée de conservation des événements dans D1
const hits = new Map();

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
export function clsClean(v) { v = String(v == null ? '' : v).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12); return v.length >= 3 ? v : ''; }

/* Événement à stocker pour le tableau de bord : seulement les élèves ayant consenti (login, series, end, exit). */
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
  if (origin && origin !== clean(env.ALLOWED_ORIGIN, 200)) return withCors(J({ error: 'origin' }, 403));
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
    const seen = [clean(p.ip, 45) && 'IP: ' + clean(p.ip, 45), place(p) && 'المدينة: ' + place(p) + (p.cityApprox ? ' (تقريبية)' : ''), clean(p.isp, 60) && 'المزوّد: ' + clean(p.isp, 60)].filter(Boolean);
    return ['الاسم: ' + name, 'الجهاز: ' + clean(p.device, 120)].concat(seen);
  };
  if (type === 'login') {
    const obs = [];
    if (p.consent && ip) obs.push('IP (من الخادم): ' + clean(ip, 45));
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
    const allowed0 = clean(env.ALLOWED_ORIGIN, 200);
    if (url.pathname.indexOf('/api/teacher/') === 0) return teacher(request, env, url, { 'Access-Control-Allow-Origin': allowed0 || 'null', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Vary': 'Origin' });
    const origin = request.headers.get('Origin') || '';
    const allowed = clean(env.ALLOWED_ORIGIN, 200);
    const cors = { 'Access-Control-Allow-Origin': allowed || 'null', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return new Response('method', { status: 405, headers: cors });
    if (!allowed || (origin && origin !== allowed)) return new Response('origin', { status: 403, headers: cors });
    if (!env.BOT_TOKEN || !env.CHAT_ID) return new Response('config', { status: 500, headers: cors });
    const raw = await request.text();
    if (raw.length > MAX_BODY) return new Response('size', { status: 413, headers: cors });
    let p; try { p = JSON.parse(raw); } catch (_) { return new Response('json', { status: 400, headers: cors }); }
    if (!p || typeof p !== 'object') return new Response('json', { status: 400, headers: cors });
    const ip = request.headers.get('CF-Connecting-IP') || '', now = Date.now();
    if (limited('ip:' + ip, LIMIT_IP, 60000, now)) return new Response('rate', { status: 429, headers: cors });
    const sid = clean(p.sid, 40);
    if (sid && limited('sid:' + sid, LIMIT_SESSION, 3600000, now)) return new Response('rate', { status: 429, headers: cors });
    const text = format(p, request.cf, ip);
    if (!text) return new Response('type', { status: 400, headers: cors });
    await store(env, toRow(p, now));
    const r = await fetch('https://api.telegram.org/bot' + env.BOT_TOKEN + '/sendMessage', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text: text.slice(0, 3900), disable_web_page_preview: true })
    });
    return new Response(r.ok ? 'ok' : 'telegram', { status: r.ok ? 200 : 502, headers: cors });
  }
};
