import worker, { format, toRow } from './worker.js';
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const sent = [];
globalThis.fetch = async (url, init) => { sent.push({ url, body: JSON.parse(init.body) }); return new Response('{"ok":true}', { status: 200 }); };
const env = { BOT_TOKEN: 'TKN', CHAT_ID: '123', ALLOWED_ORIGIN: 'https://itech327.github.io' };
const req = (body, o = {}) => new Request('https://w.example/', { method: o.method || 'POST', headers: Object.assign({ Origin: 'https://itech327.github.io', 'CF-Connecting-IP': o.ip || '203.0.113.9' }, o.headers || {}), body: o.method === 'OPTIONS' ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)) });
let r = await worker.fetch(req({ type: 'open', page: 'Maths en mouvement' }), env);
ok(r.status === 200 && sent[0].body.text.includes('زائر مجهول'), 'open anonyme');
ok(sent[0].url === 'https://api.telegram.org/botTKN/sendMessage' && sent[0].body.chat_id === '123', 'envoi Telegram avec secrets de env');
r = await worker.fetch(req({ type: 'login', page: 'SVT', name: 'Salma', device: 'Téléphone / Android 13', consent: true, ip: '198.51.100.4', city: 'Rabat', country: 'Morocco', sid: 's1' }), env);
ok(r.status === 200 && sent[1].body.text.includes('Salma') && sent[1].body.text.includes('Rabat') && sent[1].body.text.includes('203.0.113.9'), 'login : nom, ville, IP serveur');
r = await worker.fetch(req({ type: 'series', page: 'Maths', name: 'Salma', title: 'Équations', d: 4, good: 4, asked: 5, pct: 80, pts: 20, max: 25, sid: 's1' }), env);
ok(sent[2].body.text.includes('تحدّي') && sent[2].body.text.includes('4/5'), 'série : niveau et score');
r = await worker.fetch(req({ type: 'end', page: 'Maths', name: 'Salma', device: 'x', durMs: 125000, n: 20, ok: 15, pct: 75, pts: 30, hints: 2, lv: [[5, 5], [5, 6], [3, 5], [2, 4]], weak: [{ title: 'Thalès', pct: 40 }], sid: 's1' }), env);
ok(sent[3].body.text.includes('Thalès') && sent[3].body.text.includes('2 min 5 s'), 'fin : durée et fiches faibles');
r = await worker.fetch(new Request('https://w.example/', { method: 'POST', headers: { Origin: 'https://evil.example' }, body: '{"type":"open"}' }), env);
ok(r.status === 403, 'origine refusée');
r = await worker.fetch(req('pas du json'), env); ok(r.status === 400, 'JSON invalide refusé');
r = await worker.fetch(req({ type: 'zzz' }), env); ok(r.status === 400, 'type inconnu refusé');
r = await worker.fetch(req('x'.repeat(5000)), env); ok(r.status === 413, 'corps trop gros refusé');
r = await worker.fetch(req({}, { method: 'OPTIONS' }), env); ok(r.status === 204 && r.headers.get('Access-Control-Allow-Origin') === env.ALLOWED_ORIGIN, 'préflight CORS');
let c429 = 0; for (let i = 0; i < 60; i++) { const x = await worker.fetch(req({ type: 'open', page: 'p' }, { ip: '198.18.0.1' }), env); if (x.status === 429) c429++; }
ok(c429 > 0, 'limite par IP : ' + c429 + ' refus sur 60');
ok(!format({ type: 'login', name: 'A\nB<script>', device: 'd', consent: false, page: 'P' }, {}, '1.1.1.1').includes('1.1.1.1'), 'sans consentement : IP serveur absente');
r = await worker.fetch(req({ type: 'open' }), { ALLOWED_ORIGIN: env.ALLOWED_ORIGIN }); ok(r.status === 500, 'config manquante : 500');

/* ---- tableau de bord : stockage D1 et API enseignant ---- */
const rows = [];
const fakeDB = { prepare(sql) { return { sql, args: [], bind(...a) { this.args = a; return this; },
  async run() { if (/^INSERT/.test(sql)) rows.push({ id: rows.length + 1, ts: this.args[0], cls: this.args[1], sid: this.args[2], type: this.args[3], app: this.args[4], name: this.args[5], data: this.args[6] });
    if (/^DELETE FROM events WHERE sid/.test(sql)) { const n = rows.length; for (let i = rows.length - 1; i >= 0; i--) if (rows[i].sid === this.args[0]) rows.splice(i, 1); return { meta: { changes: n - rows.length } }; } return { meta: { changes: 0 } }; },
  async all() { if (/GROUP BY cls/.test(sql)) { const m = {}; rows.forEach((r) => { (m[r.cls] = m[r.cls] || new Set()).add(r.sid); }); return { results: Object.keys(m).map((k) => ({ cls: k, n: m[k].size })) }; }
    return { results: rows.filter((r) => (!/cls = \?/.test(sql) || r.cls === this.args[1])).slice().reverse() }; } }; } };
const env2 = Object.assign({}, env, { DB: fakeDB });
sent.length = 0;
await worker.fetch(req({ type: 'open', page: 'Maths' }, { ip: '198.18.1.1' }), env2);
ok(rows.length === 0, 'visite anonyme : rien dans D1');
await worker.fetch(req({ type: 'login', page: 'Maths', name: 'Salma', device: 'x', consent: true, sid: 'sa1', cls: 'ab-12', ip: 'secret-ip', city: 'Rabat' }, { ip: '198.18.1.2' }), env2);
await worker.fetch(req({ type: 'series', page: 'Maths', name: 'Salma', title: 'Thalès', d: 2, good: 4, asked: 5, pct: 80, pts: 8, max: 10, sid: 'sa1', cls: 'AB12' }, { ip: '198.18.1.2' }), env2);
await worker.fetch(req({ type: 'login', page: 'SVT', name: 'Omar', device: 'y', consent: true, sid: 'om1', cls: 'ZZ99' }, { ip: '198.18.1.3' }), env2);
ok(rows.length === 3 && rows[0].cls === 'AB12' && rows[1].type === 'series', 'événements consentis stockés, code normalisé');
ok(!rows.some((r) => /secret-ip/.test(r.data)), 'IP du client jamais stockée');
ok(sent.length >= 4, 'alertes Telegram toujours envoyées');
const noname = toRow({ type: 'login', sid: 'x1' }, 1); ok(noname === null, 'sans nom : non stocké');
ok(toRow({ type: 'open' }, 1) === null, 'type open : non stocké');
const tReq = (path, o = {}) => new Request('https://taalim.men' + path, { method: o.method || 'GET', headers: o.noAccess ? {} : { 'Cf-Access-Jwt-Assertion': 'jwt' }, body: o.body });
r = await worker.fetch(tReq('/api/teacher/events', { noAccess: true }), env2); ok(r.status === 403, 'API enseignant sans Access : 403');
r = await worker.fetch(tReq('/api/teacher/events'), { ALLOWED_ORIGIN: env.ALLOWED_ORIGIN }); ok(r.status === 503, 'API enseignant sans D1 : 503');
r = await worker.fetch(tReq('/api/teacher/events'), env2); let j = await r.json();
ok(r.status === 200 && j.events.length === 3 && j.classes.length === 2 && j.events[0].data && typeof j.events[0].data === 'object', 'liste des événements et des classes');
ok(r.headers.get('Cache-Control') === 'no-store', 'réponse non mise en cache');
r = await worker.fetch(tReq('/api/teacher/events?cls=zz-99'), env2); j = await r.json(); ok(j.events.length === 1 && j.events[0].name === 'Omar', 'filtre par classe');
r = await worker.fetch(tReq('/api/teacher/delete', { method: 'POST', body: JSON.stringify({ sid: 'sa1' }) }), env2); j = await r.json();
ok(j.ok && j.deleted === 2 && rows.length === 1, 'suppression des données d’un élève (droit des parents)');
r = await worker.fetch(tReq('/api/teacher/nimporte'), env2); ok(r.status === 404, 'route inconnue : 404');
console.log('FAILS:', fails); process.exit(fails ? 1 : 0);
