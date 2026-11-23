import worker, { format, toRow, _reset, classes, makePass, checkPass } from './worker.js';
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const sent = [];
const verif = [];
globalThis.fetch = async (url, init) => {
  if (/siteverify/.test(url)) { const t = init.body.get('response'); verif.push({ secret: init.body.get('secret'), t }); return new Response(JSON.stringify({ success: t === 'bon-jeton' || t === 'autre-site', hostname: t === 'autre-site' ? 'evil.example' : 'itech327.github.io' }), { status: 200 }); }
  sent.push({ url, body: JSON.parse(init.body) }); return new Response('{"ok":true}', { status: 200 });
};
const env = { BOT_TOKEN: 'TKN', CHAT_ID: '123', ALLOWED_ORIGIN: 'https://itech327.github.io' };
const req = (body, o = {}) => new Request('https://w.example/', { method: o.method || 'POST', headers: Object.assign({ Origin: 'https://itech327.github.io', 'CF-Connecting-IP': o.ip || '203.0.113.9' }, o.headers || {}), body: o.method === 'OPTIONS' ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)) });
let r = await worker.fetch(req({ type: 'open', page: 'Maths en mouvement' }), env);
ok(r.status === 200 && sent[0].body.text.includes('زائر مجهول'), 'open anonyme');
ok(sent[0].url === 'https://api.telegram.org/botTKN/sendMessage' && sent[0].body.chat_id === '123', 'envoi Telegram avec secrets de env');
r = await worker.fetch(req({ type: 'login', page: 'SVT', name: 'Salma', device: 'Téléphone / Android 13', consent: true, ip: '198.51.100.4', city: 'Rabat', country: 'Morocco', sid: 's1' }), env);
ok(r.status === 200 && sent[1].body.text.includes('Salma') && sent[1].body.text.includes('Rabat') && !sent[1].body.text.includes('203.0.113.9') && !sent[1].body.text.includes('198.51.100.4'), 'login : nom, ville, aucune IP');
ok(sent[1].body.text.includes('غير موثّق'), 'login sans classe connue : alerte marquée non vérifiée');
r = await worker.fetch(new Request('https://w.example/', { method: 'POST', headers: { 'CF-Connecting-IP': '203.0.113.50' }, body: '{"type":"open"}' }), env);
ok(r.status === 403, 'sans en-tête Origin (curl, script) : refusé');
r = await worker.fetch(new Request('https://w.example/', { method: 'POST', headers: { Origin: 'null', 'CF-Connecting-IP': '203.0.113.51' }, body: '{"type":"open"}' }), env);
ok(r.status === 403, 'Origin null : refusé');
ok(classes({}).indexOf('2APIC3') >= 0 && classes({}).indexOf('1APIC') >= 0 && classes({}).length === 12, 'classes par défaut : 1APIC à 3APIC, groupes 1 à 3');
ok(classes({ CLASSES: '3apic4, 2APIC1' }).join() === '3APIC4,2APIC1', 'variable CLASSES prioritaire');
r = await worker.fetch(req({ type: 'series', page: 'Maths', name: 'Salma', title: 'Équations', d: 4, good: 4, asked: 5, pct: 80, pts: 20, max: 25, sid: 's1' }), env);
ok(sent[2].body.text.includes('تحدّي') && sent[2].body.text.includes('4/5'), 'série : niveau et score');
r = await worker.fetch(req({ type: 'end', page: 'Maths', name: 'Salma', device: 'x', durMs: 125000, n: 20, ok: 15, pct: 75, pts: 30, hints: 2, lv: [[5, 5], [5, 6], [3, 5], [2, 4]], weak: [{ title: 'Thalès', pct: 40 }], sid: 's1' }), env);
ok(sent[3].body.text.includes('Thalès') && sent[3].body.text.includes('2 min 5 s'), 'fin : durée et fiches faibles');
r = await worker.fetch(new Request('https://w.example/', { method: 'POST', headers: { Origin: 'https://evil.example' }, body: '{"type":"open"}' }), env);
ok(r.status === 403, 'origine refusée');
r = await worker.fetch(req('pas du json'), env); ok(r.status === 400, 'JSON invalide refusé');
_reset();
r = await worker.fetch(req({ type: 'zzz' }), env); ok(r.status === 400, 'type inconnu refusé');
r = await worker.fetch(req('x'.repeat(5000)), env); ok(r.status === 413, 'corps trop gros refusé');
r = await worker.fetch(req({}, { method: 'OPTIONS' }), env); ok(r.status === 204 && r.headers.get('Access-Control-Allow-Origin') === env.ALLOWED_ORIGIN, 'préflight CORS');
const envMulti = Object.assign({}, env, { ALLOWED_ORIGIN: 'https://a.example,https://relay-client.example' });
r = await worker.fetch(new Request('https://w.example/', { method: 'OPTIONS', headers: { Origin: 'https://relay-client.example' } }), envMulti); ok(r.status === 204 && r.headers.get('Access-Control-Allow-Origin') === 'https://relay-client.example', 'plusieurs origines : la deuxième est acceptée');
let c429 = 0; for (let i = 0; i < 60; i++) { const x = await worker.fetch(req({ type: 'open', page: 'p' }, { ip: '198.18.0.1' }), env); if (x.status === 429) c429++; }
ok(c429 > 0, 'limite par IP : ' + c429 + ' refus sur 60');
_reset(); let call = 0; for (let i = 0; i < 40; i++) { const x = await worker.fetch(req({ type: 'open', page: 'p' }, { ip: '198.19.0.' + i }), env); if (x.status === 429) call++; }
ok(call === 10, 'limite globale : 30 alertes par minute (' + call + ' refus sur 40)'); _reset();
ok(!format({ type: 'login', name: 'A\nB<script>', device: 'd', consent: false, page: 'P' }, {}, '1.1.1.1').includes('1.1.1.1'), 'sans consentement : IP serveur absente');
r = await worker.fetch(req({ type: 'open' }), { ALLOWED_ORIGIN: env.ALLOWED_ORIGIN }); ok(r.status === 500, 'config manquante : 500');

/* ---- tableau de bord : stockage D1 et API enseignant ---- */
const rows = [];
const fakeDB = { prepare(sql) { return { sql, args: [], bind(...a) { this.args = a; return this; },
  async run() { if (/^INSERT/.test(sql)) rows.push({ id: rows.length + 1, ts: this.args[0], cls: this.args[1], sid: this.args[2], type: this.args[3], app: this.args[4], name: this.args[5], data: this.args[6] });
    if (/^DELETE FROM events WHERE sid/.test(sql)) { const n = rows.length; for (let i = rows.length - 1; i >= 0; i--) if (rows[i].sid === this.args[0]) rows.splice(i, 1); return { meta: { changes: n - rows.length } }; } return { meta: { changes: 0 } }; },
  async all() { if (/GROUP BY cls/.test(sql)) { const m = {}; rows.forEach((r) => { (m[r.cls] = m[r.cls] || new Set()).add(r.sid); }); return { results: Object.keys(m).map((k) => ({ cls: k, n: m[k].size })) }; }
    return { results: rows.filter((r) => (!/cls = \?/.test(sql) || r.cls === this.args[1])).slice().reverse() }; } }; } };
const KEY = 'cle-de-test-123456';
const env2 = Object.assign({}, env, { DB: fakeDB, TEACHER_KEY: KEY });
sent.length = 0;
await worker.fetch(req({ type: 'open', page: 'Maths' }, { ip: '198.18.1.1' }), env2);
ok(rows.length === 0, 'visite anonyme : rien dans D1');
await worker.fetch(req({ type: 'login', page: 'Maths', name: 'Salma', device: 'x', consent: true, sid: 'sa1', cls: '2apic-1', ip: 'secret-ip', city: 'Rabat' }, { ip: '198.18.1.2' }), env2);
await worker.fetch(req({ type: 'series', page: 'Maths', name: 'Salma', title: 'Thalès', d: 2, good: 4, asked: 5, pct: 80, pts: 8, max: 10, sid: 'sa1', cls: '2APIC1' }, { ip: '198.18.1.2' }), env2);
await worker.fetch(req({ type: 'login', page: 'SVT', name: 'Omar', device: 'y', consent: true, sid: 'om1', cls: '3APIC3' }, { ip: '198.18.1.3' }), env2);
ok(rows.length === 3 && rows[0].cls === '2APIC1' && rows[1].type === 'series', 'élèves d’une classe connue stockés, code normalisé');
const avant = rows.length, alertes = sent.length;
r = await worker.fetch(req({ type: 'end', page: 'Maths', name: 'PENTEST', sid: 'pt1', cls: 'PENTEST', n: 1 }, { ip: '198.18.1.4' }), env2);
ok(r.status === 200 && rows.length === avant && sent.length === alertes + 1 && sent[sent.length - 1].body.text.includes('غير موثّق'), 'classe inconnue : rien dans la base, alerte marquée');
r = await worker.fetch(req({ type: 'series', page: 'Maths', name: 'X', sid: 'x9' }, { ip: '198.18.1.5' }), env2);
ok(rows.length === avant, 'sans classe : rien dans la base');
ok(!rows.some((r) => /secret-ip/.test(r.data)), 'IP du client jamais stockée');
ok(sent.length >= 4, 'alertes Telegram toujours envoyées');
const noname = toRow({ type: 'login', sid: 'x1' }, 1); ok(noname === null, 'sans nom : non stocké');
ok(toRow({ type: 'open' }, 1) === null, 'type open : non stocké');
const tReq = (path, o = {}) => new Request('https://w.example' + path, { method: o.method || 'GET', headers: Object.assign({ Origin: o.origin || env.ALLOWED_ORIGIN, 'CF-Connecting-IP': o.ip || '192.0.2.10' }, o.noAccess ? {} : { Authorization: 'Bearer ' + (o.key || KEY) }), body: o.body });
r = await worker.fetch(tReq('/api/teacher/events', { noAccess: true }), env2); ok(r.status === 401, 'API enseignant sans clé : 401');
r = await worker.fetch(tReq('/api/teacher/events', { key: 'faux' }), env2); ok(r.status === 401, 'mauvaise clé : 401');
r = await worker.fetch(tReq('/api/teacher/events', { key: KEY.slice(0, -1) }), env2); ok(r.status === 401, 'clé tronquée : 401');
r = await worker.fetch(tReq('/api/teacher/events'), { ALLOWED_ORIGIN: env.ALLOWED_ORIGIN, DB: fakeDB }); ok(r.status === 503, 'clé non configurée : tout refusé (503)');
r = await worker.fetch(tReq('/api/teacher/events'), { ALLOWED_ORIGIN: env.ALLOWED_ORIGIN, DB: fakeDB, TEACHER_KEY: 'court' }); ok(r.status === 503, 'clé trop courte : refusée (503)');
r = await worker.fetch(tReq('/api/teacher/events', { origin: 'https://evil.example' }), env2); ok(r.status === 403, 'autre origine : 403');
r = await worker.fetch(tReq('/api/teacher/events'), { ALLOWED_ORIGIN: env.ALLOWED_ORIGIN, TEACHER_KEY: KEY }); ok(r.status === 503, 'sans D1 : 503');
r = await worker.fetch(new Request('https://w.example/api/teacher/events', { method: 'OPTIONS', headers: { Origin: env.ALLOWED_ORIGIN } }), env2); ok(r.status === 204 && /Authorization/.test(r.headers.get('Access-Control-Allow-Headers')), 'préflight de l’API enseignant');
r = await worker.fetch(tReq('/api/teacher/events'), env2); let j = await r.json();
ok(r.status === 200 && j.events.length === 3 && j.classes.length === 2 && j.events[0].data && typeof j.events[0].data === 'object', 'liste des événements et des classes');
ok(r.headers.get('Cache-Control') === 'no-store' && r.headers.get('Access-Control-Allow-Origin') === env.ALLOWED_ORIGIN, 'réponse non mise en cache, CORS limité');
r = await worker.fetch(tReq('/api/teacher/events?cls=3apic-3'), env2); j = await r.json(); ok(j.events.length === 1 && j.events[0].name === 'Omar', 'filtre par classe');
r = await worker.fetch(tReq('/api/teacher/delete', { method: 'POST', body: JSON.stringify({ sid: 'sa1' }) }), env2); j = await r.json();
ok(j.ok && j.deleted === 2 && rows.length === 1, 'suppression des données d’un élève (droit des parents)');
r = await worker.fetch(tReq('/api/teacher/nimporte'), env2); ok(r.status === 404, 'route inconnue : 404');
let blocked = 0; for (let i = 0; i < 14; i++) { const x = await worker.fetch(tReq('/api/teacher/events', { key: 'mauvaise-cle-' + i, ip: '192.0.2.77' }), env2); if (x.status === 429) blocked++; }
ok(blocked === 4, 'blocage après 10 échecs : ' + blocked + ' refus 429');
r = await worker.fetch(tReq('/api/teacher/events', { ip: '192.0.2.77' }), env2); ok(r.status === 429, 'IP bloquée même avec la bonne clé');

/* ---- phase 2 : Turnstile ---- */
_reset(); rows.length = 0; sent.length = 0;
const env3 = Object.assign({}, env2, { TURNSTILE_SECRET: 'secret-ts-test' });
const tok = (t, o = {}) => new Request('https://w.example/token', { method: 'POST', headers: { Origin: o.origin || env.ALLOWED_ORIGIN, 'CF-Connecting-IP': o.ip || '198.51.100.70' }, body: JSON.stringify({ t }) });
r = await worker.fetch(tok('bon-jeton'), env2); ok(r.status === 404, 'sans TURNSTILE_SECRET : /token désactivé');
r = await worker.fetch(tok('bon-jeton'), env3); j = await r.json();
ok(r.status === 200 && /^\d+\.[\w-]+$/.test(j.pass) && verif[verif.length - 1].secret === 'secret-ts-test', 'jeton valide : laissez-passer signé');
const pass = j.pass;
ok(r.headers.get('Access-Control-Allow-Origin') === env.ALLOWED_ORIGIN, '/token : CORS limité à l’origine');
r = await worker.fetch(tok('mauvais'), env3); ok(r.status === 403, 'jeton refusé par Cloudflare : 403');
r = await worker.fetch(tok('autre-site'), env3); ok(r.status === 403, 'jeton d’un autre site : 403');
r = await worker.fetch(tok('bon-jeton', { origin: 'https://evil.example' }), env3); ok(r.status === 403, '/token depuis une autre origine : 403');
r = await worker.fetch(new Request('https://w.example/token', { method: 'POST', headers: { 'CF-Connecting-IP': '198.51.100.71' }, body: '{"t":"bon-jeton"}' }), env3); ok(r.status === 403, '/token sans Origin : 403');
let t429 = 0; for (let i = 0; i < 14; i++) { const x = await worker.fetch(tok('mauvais', { ip: '198.51.100.72' }), env3); if (x.status === 429) t429++; }
ok(t429 === 4, '/token : 10 essais par minute (' + t429 + ' refus)');
const now0 = Date.now();
ok(await checkPass(env3, env.ALLOWED_ORIGIN, pass, now0), 'laissez-passer valide');
ok(!(await checkPass(env3, 'https://evil.example', pass, now0)), 'laissez-passer lié à l’origine');
ok(!(await checkPass(Object.assign({}, env3, { TURNSTILE_SECRET: 'autre' }), env.ALLOWED_ORIGIN, pass, now0)), 'laissez-passer lié au secret');
ok(!(await checkPass(env3, env.ALLOWED_ORIGIN, pass, now0 + 7 * 3600 * 1000)), 'laissez-passer expiré après 6 h');
ok(!(await checkPass(env3, env.ALLOWED_ORIGIN, pass.slice(0, -2) + 'AA', now0)), 'signature modifiée : refusée');
const loin = await makePass(env3, env.ALLOWED_ORIGIN, String(now0 + 48 * 3600 * 1000));
ok(!(await checkPass(env3, env.ALLOWED_ORIGIN, loin, now0)), 'date d’expiration trop lointaine : refusée');
await worker.fetch(req({ type: 'series', page: 'Maths', name: 'Salma', title: 'T', sid: 'ts1', cls: '2APIC1', pass }, { ip: '198.18.2.1' }), env3);
ok(rows.length === 1 && !/pass/.test(rows[0].data), 'élève avec laissez-passer : stocké, laissez-passer non stocké');
await worker.fetch(req({ type: 'series', page: 'Maths', name: 'Bot', title: 'T', sid: 'ts2', cls: '2APIC1' }, { ip: '198.18.2.2' }), env3);
ok(rows.length === 1 && sent[sent.length - 1].body.text.includes('Turnstile'), 'sans laissez-passer : alerte marquée, rien stocké');
await worker.fetch(req({ type: 'series', page: 'Maths', name: 'Bot', title: 'T', sid: 'ts3', cls: '2APIC1', pass: '123.abc' }, { ip: '198.18.2.3' }), env3);
ok(rows.length === 1, 'faux laissez-passer : rien stocké');
r = await worker.fetch(req({ type: 'open', page: 'Maths' }, { ip: '198.18.2.4' }), env3); ok(r.status === 200, 'visite anonyme : aucun laissez-passer demandé');
console.log('FAILS:', fails); process.exit(fails ? 1 : 0);
