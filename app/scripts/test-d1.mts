// Tests the D1 data layer against a real local D1 and KV (wrangler getPlatformProxy,
// from the connector's wrangler install). Run from app/:  npm run test:d1
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { d1Data, type D1Like, type KVLike } from '../src/lib/data/d1';
import { estimateSeconds } from '../src/lib/text';

const require = createRequire(new URL('../../connector/package.json', import.meta.url));
const { getPlatformProxy } = require('wrangler') as typeof import('wrangler');

let passed = 0;
function check(name: string, cond: unknown) {
  if (!cond) { console.error(`FAIL  ${name}`); process.exitCode = 1; return; }
  passed++; console.log(`ok    ${name}`);
}

const proxy = await getPlatformProxy<{ DB: unknown; KV: unknown }>({
  configPath: new URL('./wrangler.test.jsonc', import.meta.url).pathname, persist: false, remoteBindings: false,
});
const db = proxy.env.DB as D1Like & { prepare(sql: string): { run(): Promise<unknown> } };
const kv = proxy.env.KV as KVLike;
const sql = readFileSync(new URL('../migrations/0001_init.sql', import.meta.url), 'utf8')
  .split('\n').filter((l) => !l.trim().startsWith('--')).join('\n');
for (const stmt of sql.split(';').map((s) => s.trim()).filter(Boolean)) await db.prepare(stmt).run();

const data = d1Data(db, kv);

// accounts
const a = await data.createUser('Test@Example.com', 'password123');
check('create user', a.ok && a.value.email === 'test@example.com');
check('duplicate email refused (any case)', !(await data.createUser('TEST@example.com', 'password123')).ok);
check('short password refused', (await data.createUser('b@example.com', 'short')).ok === false);
check('right password accepted', (await data.verifyUser('test@example.com', 'password123')).ok);
check('wrong password refused', !(await data.verifyUser('test@example.com', 'wrongpass1')).ok);
if (!a.ok) throw new Error('cannot continue');
const uid = a.value.id;

// sessions
const tok = await data.createSession(uid);
check('session finds the user', (await data.userForSession(tok))?.id === uid);
const stored = await db.prepare('SELECT token_hash FROM sessions').first<{ token_hash: string }>();
check('token stored only as a hash', stored && stored.token_hash !== tok && stored.token_hash.length === 64);
await data.endSession(tok);
check('ended session is gone', (await data.userForSession(tok)) === null);

// trial
check('first trial claim works', await data.claimTrial(uid));
check('second trial claim refused', !(await data.claimTrial(uid)));
check('trial gives 60 s', (await data.getBalance(uid)).secondsLeft === 60);

// generation, reserve and release
const text = 'سلام، هادي تجربة صغيرة ديال الصوت.';
const need = estimateSeconds(text);
const g1 = await data.createGeneration({ userId: uid, voiceId: 'v-ar-MA-0', dialect: 'ar-MA', text });
check('generation created and reserved', g1.ok && g1.value.secondsReserved === need);
check('balance drops by the reserve', (await data.getBalance(uid)).secondsLeft === 60 - need);
if (!g1.ok) throw new Error('cannot continue');
await data.completeGeneration(g1.value.id, new Uint8Array([82, 73, 70, 70]), 'audio/wav', 1);
check('unused seconds released after synthesis', (await data.getBalance(uid)).secondsLeft === 59);
const done = await data.getGeneration(g1.value.id, uid);
check('generation done, charged 1 s', done?.status === 'done' && done.secondsCharged === 1);
check('audio readable by owner', (await data.getAudio(g1.value.id, uid))?.audio.length === 4);

const g2 = await data.createGeneration({ userId: uid, voiceId: 'v-ar-MA-0', dialect: 'ar-MA', text });
if (g2.ok) await data.failGeneration(g2.value.id, 'engine down');
check('failed generation refunds everything', (await data.getBalance(uid)).secondsLeft === 59);
check('failed generation charged 0', g2.ok && (await data.getGeneration(g2.value.id, uid))?.secondsCharged === 0);

// rules
check('premium voice refused without a purchase', !(await data.createGeneration({ userId: uid, voiceId: 'v-ar-MA-f1', dialect: 'ar-MA', text })).ok);
check('voice and dialect must match', !(await data.createGeneration({ userId: uid, voiceId: 'v-ar-MA-0', dialect: 'ar-EG', text })).ok);
const big = 'ب'.repeat(5000);
const r = await data.createGeneration({ userId: uid, voiceId: 'v-ar-MA-0', dialect: 'ar-MA', text: big });
check('not enough credit refused', !r.ok && r.code === 'insufficient_credits');

// purchases: soonest-expiring lot is spent first
await data.grantSeconds(uid, 100, 'purchase', new Date(Date.now() + 864e5));
await data.grantSeconds(uid, 100, 'purchase', new Date(Date.now() + 30 * 864e5));
const g3 = await data.createGeneration({ userId: uid, voiceId: 'v-ar-MA-0', dialect: 'ar-MA', text });
const { results: lots } = await db.prepare("SELECT seconds_left, expires_at FROM credit_lots WHERE source = 'purchase' ORDER BY expires_at").all<{ seconds_left: number }>();
check('soonest-expiring purchase lot spent first', g3.ok && lots[0].seconds_left === 100 - need && lots[1].seconds_left === 100);
check('balance shows nearest expiry', (await data.getBalance(uid)).nextExpiry !== null);

// free regeneration: once, same settings, subscriber
if (g3.ok) await data.completeGeneration(g3.value.id, new Uint8Array(4), 'audio/wav', need);
const before = (await data.getBalance(uid)).secondsLeft;
const re1 = g3.ok ? await data.createGeneration({ userId: uid, voiceId: 'v-ar-MA-0', dialect: 'ar-MA', text, regeneratedFrom: g3.value.id }) : null;
check('first regeneration is free', re1?.ok && re1.value.isFreeRegen && (await data.getBalance(uid)).secondsLeft === before);
const re2 = g3.ok ? await data.createGeneration({ userId: uid, voiceId: 'v-ar-MA-0', dialect: 'ar-MA', text, regeneratedFrom: g3.value.id }) : null;
check('second regeneration is paid', re2?.ok && !re2.value.isFreeRegen);

// concurrency: two spends racing for the last seconds, only one may win
const v = await data.createUser('race@example.com', 'password123');
if (v.ok) {
  await data.grantSeconds(v.value.id, need, 'purchase', null);
  const both = await Promise.all([1, 2].map(() => data.createGeneration({ userId: v.value.id, voiceId: 'v-ar-MA-0', dialect: 'ar-MA', text })));
  const wins = both.filter((x) => x.ok).length;
  const left = (await data.getBalance(v.value.id)).secondsLeft;
  check(`racing spends never overdraw (wins=${wins}, left=${left})`, wins === 1 && left === 0);
}

// account deletion keeps the trial claim
await data.deleteUser(uid);
check('deleted user is gone', (await data.getUser(uid)) === null);
const again = await data.createUser('test@example.com', 'password123');
check('same email cannot claim a second trial', again.ok && !(await data.claimTrial(again.value.id)));

await proxy.dispose();
console.log(`\n${passed} checks passed${process.exitCode ? ', some FAILED' : ''}`);
