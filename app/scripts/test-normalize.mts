// Checks the TypeScript Darija normalizer against the Python one it was ported from,
// then checks the Gemini profiles. Run from app/:  npm run test:normalize
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { normalizeDarija, RESPELL } from '../src/lib/darija-normalize';

const SKILL = new URL('../../.claude/skills/darija-voice/', import.meta.url).pathname;
let passed = 0, failed = 0;
function check(name: string, got: string, want: string) {
  if (got === want) { passed++; return; }
  failed++;
  console.error(`FAIL  ${name}\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`);
}

// 1. the respell list shipped with the app matches the skill's data file
const tsv: Record<string, string> = {};
for (const line of readFileSync(`${SKILL}data/respell.tsv`, 'utf8').split('\n')) {
  if (line.trim() && !line.startsWith('#') && line.includes('\t')) {
    const [w, r] = line.split('\t');
    tsv[w.trim()] = r.trim();
  }
}
check('respell.json matches respell.tsv', JSON.stringify(RESPELL, Object.keys(RESPELL).sort()), JSON.stringify(tsv, Object.keys(tsv).sort()));

// 2. profile "open" gives exactly the Python output
const vocab = new Map<string, number>();
for (const line of readFileSync(`${SKILL}data/doda_vocab.tsv`, 'utf8').split('\n')) {
  if (line.startsWith('#') || !line.includes('\t')) continue;
  const [w, n] = line.split('\t');
  vocab.set(w, Number(n));
}
const extra = [
  'عندي 1250000 درهم و 3afak jib l\'mail', 'تمن 99.75 dh فقط!!!', 'الساعة 3 h و 45 min', '7 كغ ديال البطيخة',
  'Bonjour, wach kayn chi taxi? ok merci', 'ذهبت إلى السوق، واشتريت 12 كيلو من الخضر.', 'Facebook w Instagram w youtube',
  'lyoum f lmatch rbe7na 3-1', 'كاين 1000 و 2000000 و 10000', 'ddar w ssbah w zzitoun', 'سلام 👋🏽 كيداير؟؟',
  'هاد الشي ب 100% صحيح', 'غادي نمشي ل 3 أيام', 'مرحبا بيكم فالبطيخة', 'رقم 212612345678 ديالي', 'wa7d 2 l7em, 3 tajine',
];
const sentences = readFileSync(`${SKILL}data/test_sentences.txt`, 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#'));
const pyTests = execFileSync('python3', ['-I', '-c', `import sys, json; sys.path.insert(0, ${JSON.stringify(`${SKILL}scripts`)}); import normalize as n; print(json.dumps([s for s, _ in n.TESTS], ensure_ascii=False))`]).toString();
const inputs = [...JSON.parse(pyTests) as string[], ...sentences, ...extra];
const pyOut = JSON.parse(execFileSync('python3', ['-I', '-c',
  `import sys, json; sys.path.insert(0, ${JSON.stringify(`${SKILL}scripts`)}); import normalize as n; print(json.dumps([n.normalize(s) for s in json.load(sys.stdin)], ensure_ascii=False))`],
  { input: JSON.stringify(inputs) }).toString()) as string[];
inputs.forEach((s, i) => check(`open: ${s}`, normalizeDarija(s, { profile: 'open', vocab }), pyOut[i]));

// 3. Gemini profiles
const G: [string, string][] = [
  ['25 درهم', 'خمسة وعشرين درهم'],
  ['ara chi bttikha nakloha m3a ssbah', 'أرا شي بطّيخة ناكلوها مع الصباح'],
  ['مشيت إلى الدار', 'مشيت إلى الدار'],                    // hamza kept
  ['ڭالها ليا', 'گالها ليا'],                               // g kept for Gemini
  ['كأنني فعلا فلاح', 'كأنني فعلا فلّاح'],                    // respelling applies
  ['5 كغ و 20 km', 'خمسة كيلو و عشرين كيلومتر'],
];
for (const [s, want] of G) check(`gemini: ${s}`, normalizeDarija(s, { profile: 'gemini' }), want);
const F: [string, string][] = [
  ['يسعدنا أن نرحب بكم في عام 2026', 'يسعدنا أن نرحب بكم في عام 2026'], // numbers left to Gemini in Standard Arabic
  ['إلى اللقاء!!!', 'إلى اللقاء!'],
  ['زوييييين 😍', 'زويين'],
];
for (const [s, want] of F) check(`gemini-fusha: ${s}`, normalizeDarija(s, { profile: 'gemini-fusha' }), want);

console.log(`${passed} passed, ${failed} failed (${inputs.length} sentences compared with Python)`);
if (failed) process.exitCode = 1;
