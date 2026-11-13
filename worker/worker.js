/* Relais Telegram pour « Cours en mouvement » (Cloudflare Worker).
   Secrets (jamais dans le dépôt) : BOT_TOKEN, CHAT_ID.
   Variable : ALLOWED_ORIGIN, par exemple https://itech327.github.io */

const MAX_BODY = 4000;
const LIMIT_IP = 40;       // messages par minute et par IP
const LIMIT_SESSION = 60;  // messages par heure et par session
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
    const r = await fetch('https://api.telegram.org/bot' + env.BOT_TOKEN + '/sendMessage', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text: text.slice(0, 3900), disable_web_page_preview: true })
    });
    return new Response(r.ok ? 'ok' : 'telegram', { status: r.ok ? 200 : 502, headers: cors });
  }
};
