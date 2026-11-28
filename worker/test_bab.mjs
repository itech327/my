/* Tests du jeu « الباب الموالي » contre une vraie base SQLite (node:sqlite), même SQL que D1. node test_bab.mjs */
import worker, { babRow, babProgress, babStuck, babAlertText, babCron, _reset } from './worker.js';
import { DatabaseSync } from 'node:sqlite'; import fs from 'fs';
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const db = new DatabaseSync(':memory:'); db.exec(fs.readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));
const D1 = { prepare(sql) { const st = db.prepare(sql); let a = []; return { bind(...x) { a = x; return this; }, async run() { const r = st.run(...a); return { meta: { changes: r.changes } }; }, async all() { return { results: st.all(...a) }; } }; } };
const sent = []; globalThis.fetch = async (url, init) => { sent.push(JSON.parse(init.body)); return new Response('{"ok":true}', { status: 200 }); };
const env = { DB: D1, BOT_TOKEN: 'T', CHAT_ID: '1', ALLOWED_ORIGIN: 'https://taalim.men,https://pro.taalim.men' };
const O = 'https://pro.taalim.men';
const post = (b, o = {}) => worker.fetch(new Request('https://relay.taalim.men/api/bab', { method: 'POST', headers: Object.assign({ 'CF-Connecting-IP': o.ip || '10.0.0.1' }, o.origin === null ? {} : { Origin: o.origin || O }), body: typeof b === 'string' ? b : JSON.stringify(b) }), env);
const get = (q, o = {}) => worker.fetch(new Request('https://relay.taalim.men/api/bab/progress?' + q, { headers: { Origin: o.origin || O, 'CF-Connecting-IP': '10.0.0.2' } }), env);
const ev = (sid, type, door, cls = '3APIC') => ({ chapter: 'pc-3ac-energie', cls, sid, type, door });
const count = () => db.prepare('SELECT COUNT(*) n FROM bab_events').get().n;

let r = await post(ev('abc123def4', 'start', 0)); ok(r.status === 204 && count() === 1, 'événement valide : 204, stocké');
const cols = db.prepare('PRAGMA table_info(bab_events)').all().map((c) => c.name); ok(!cols.some((c) => /name|ip|device|city/.test(c)), 'aucune colonne nominative (' + cols.join(',') + ')');
r = await post(Object.assign(ev('abc123def4', 'start', 0), { name: 'Salma', ip: '1.2.3.4' })); ok(r.status === 204 && !JSON.stringify(db.prepare('SELECT * FROM bab_events').all()).includes('Salma'), 'un nom envoyé est ignoré, jamais stocké');
r = await post(ev('abc123def4', 'start', 0, 'PENTEST')); ok(r.status === 400, 'classe inconnue : 400');
r = await post(ev('abc123def4', 'hack', 0)); ok(r.status === 400, 'type inconnu : 400');
r = await post(ev('abc123def4', 'start', 4)); ok(r.status === 400, 'porte hors 0..3 : 400');
r = await post(ev('ab', 'start', 0)); ok(r.status === 400, 'sid trop court : 400');
r = await post(Object.assign(ev('abc123def4', 'start', 0), { chapter: '../x' })); ok(r.status === 400, 'chapitre invalide : 400');
r = await post('pas du json'); ok(r.status === 400, 'JSON invalide : 400');
r = await post('x'.repeat(700)); ok(r.status === 413, 'corps trop gros : 413');
r = await post(ev('abc123def4', 'start', 0), { origin: 'https://evil.example' }); ok(r.status === 403, 'autre origine : 403');
r = await post(ev('abc123def4', 'start', 0), { origin: null }); ok(r.status === 403, 'sans Origin : 403');
r = await worker.fetch(new Request('https://relay.taalim.men/api/bab', { method: 'OPTIONS', headers: { Origin: O } }), env);
ok(r.status === 204 && r.headers.get('Access-Control-Allow-Origin') === O && /GET/.test(r.headers.get('Access-Control-Allow-Methods')), 'préflight CORS pour pro.taalim.men');
r = await worker.fetch(new Request('https://relay.taalim.men/api/bab', { method: 'POST', headers: { Origin: O }, body: JSON.stringify(ev('abc123def4', 'start', 0)) }), { ALLOWED_ORIGIN: O });
ok(r.status === 503, 'sans D1 : 503');
ok(babRow(ev('abc123def4', 'start', 0, '3apic'), 1, env).cls === '3APIC', 'code de classe normalisé');
_reset(); let n429 = 0; for (let i = 0; i < 130; i++) { const x = await post(ev('ratelim' + (i % 50).toString().padStart(3, '0'), 'frag', 1), { ip: '10.9.9.9' }); if (x.status === 429) n429++; }
ok(n429 === 10, 'une classe derrière une IP : 120 événements/min acceptés (' + n429 + ' refus sur 130)');
_reset(); let s429 = 0; for (let i = 0; i < 205; i++) { const x = await post(ev('spammer01', 'frag', 1), { ip: '10.8.' + Math.floor(i / 100) + '.' + (i % 100) }); if (x.status === 429) s429++; }
ok(s429 === 5, 'un appareil : 200 événements/heure (' + s429 + ' refus)'); _reset();

/* progression et blocages, avec des dates contrôlées */
db.exec('DELETE FROM bab_events'); const now = Date.UTC(2026, 11, 1, 8), day = 864e5;
const put = (sid, type, door, ago, cls = '3APIC') => db.prepare('INSERT INTO bab_events (ts, cls, sid, chapter, type, door) VALUES (?,?,?,?,?,?)').run(now - ago, cls, sid, 'pc-3ac-energie', type, door);
put('eleve0001', 'start', 0, 1 * day);
ok((await babProgress(env, '3APIC', 'pc-3ac-energie', now)).donePct === null, 'moins de 3 appareils : aucun pourcentage publié');
['eleve0001', 'eleve0002', 'eleve0003', 'eleve0004'].forEach((s, k) => { put(s, 'start', 0, 5 * day); put(s, 'done', 0, 5 * day); put(s, 'start', 1, 4 * day); if (k === 0) put(s, 'done', 1, 3 * day); });
put('eleve0002', 'done', 0, 4 * day); // doublon : ne doit pas compter deux fois
let pr = await babProgress(env, '3APIC', 'pc-3ac-energie', now); ok(pr.n === 4 && pr.donePct.join() === '100,25,0', 'progression : 100 % / 25 % / 0 %, doublons ignorés (' + pr.donePct + ')');
r = await get('cls=3apic&chapter=pc-3ac-energie'); let j = await r.json(); ok(r.status === 200 && j.donePct.join() === pr.donePct.join() && r.headers.get('Cache-Control') === 'no-store', 'GET /api/bab/progress');
r = await get('cls=PENTEST&chapter=pc-3ac-energie'); ok(r.status === 400, 'progression : classe inconnue 400');
let st = await babStuck(env, now); ok(st.length === 1 && st[0].door === 1 && st[0].n === 3, 'bloqués : 3 élèves à la porte 2 depuis > 2 jours');
put('eleve0005', 'start', 2, 1 * day); put('eleve0006', 'start', 2, 1 * day); put('eleve0007', 'start', 2, 1 * day);
st = await babStuck(env, now); ok(st.length === 1, 'commencé il y a 1 jour : pas encore bloqué');
['vieux0001', 'vieux0002', 'vieux0003'].forEach((s) => put(s, 'start', 2, 20 * day));
st = await babStuck(env, now); ok(st.length === 1, 'inactif depuis 20 jours : pas compté');
['autre0001', 'autre0002'].forEach((s) => put(s, 'start', 0, 3 * day, '3APIC2'));
st = await babStuck(env, now); ok(st.length === 1, 'seulement 2 bloqués dans une classe : pas d’alerte');
const txt = babAlertText(st); ok(/3APIC/.test(txt) && /الباب 2/.test(txt) && /3 تلاميذ/.test(txt) && !/eleve/.test(txt), 'message Telegram : classe, porte, nombre, aucun identifiant');
sent.length = 0; let c = await babCron(env, now); ok(c.sent === 1 && sent.length === 1 && sent[0].text === txt, 'cron : un seul message');
db.exec("DELETE FROM bab_events WHERE door = 1"); sent.length = 0; c = await babCron(env, now); ok(c.sent === 0 && sent.length === 0, 'cron sans groupe bloqué : aucun message');
c = await babCron({ DB: D1 }, now); ok(c.sent === 0, 'cron sans secrets Telegram : rien, pas de plantage');
console.log('FAILS:', fails); process.exit(fails ? 1 : 0);
