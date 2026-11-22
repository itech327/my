// Generates the audio library from catalog.json with the Gemini voices.
// Run from the repository root:  npx --prefix app tsx library/generate.mts [--only ID] [--redo]
//   - Skips items that already have audio, unless --redo.
//   - Stops cleanly when Google's quota is spent (HTTP 429); run again later to resume.
//   - Writes library/audio/<id>.mp3 (needs ffmpeg) and updates catalog.json.
// Key: GEMINI_API_KEY, or the cloud session's network proxy injects it (then also set
// NODE_USE_ENV_PROXY=1, or Node's fetch bypasses the proxy and Google answers 400).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { geminiStyle, type DeliveryId, type RegisterId } from '../app/src/lib/delivery';
import { normalizeDarija } from '../app/src/lib/darija-normalize';
import { designedVoice, geminiSpeak } from '../app/src/lib/tts/gemini';

interface Item {
  id: string; title: string; mode: RegisterId; voice: 'nour' | 'younes'; delivery: DeliveryId; text: string;
  status: 'pending' | 'generated' | 'approved' | 'rejected'; file?: string; seconds?: number; generatedAt?: string; spokenText?: string;
}
const VOICES = { nour: { gender: 'female', prebuilt: 'Kore' }, younes: { gender: 'male', prebuilt: 'Charon' } } as const;

const dir = new URL('./', import.meta.url).pathname;
const catalogPath = join(dir, 'catalog.json');
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8')) as { items: Item[] };
const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const redo = args.includes('--redo');
const apiKey = process.env.GEMINI_API_KEY ?? 'proxy-injected';
const save = () => writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n');

let made = 0;
for (const item of catalog.items) {
  if (only && item.id !== only) continue;
  if (item.file && !redo) continue;
  if (item.status === 'approved' && !redo) continue;
  const v = VOICES[item.voice];
  const spoken = normalizeDarija(item.text, { profile: item.mode === 'fusha' ? 'gemini-fusha' : 'gemini' });
  try {
    const out = await geminiSpeak({ text: spoken, apiKey, voice: designedVoice(item.mode, v.gender, v.prebuilt), style: geminiStyle(item.delivery, null, item.mode) });
    const tmp = mkdtempSync(join(tmpdir(), 'sada-'));
    const wav = join(tmp, 'a.wav');
    writeFileSync(wav, out.audio);
    const file = `audio/${item.id}.mp3`;
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', wav, '-ac', '1', '-b:a', '64k', join(dir, file)]);
    rmSync(tmp, { recursive: true, force: true });
    Object.assign(item, { status: 'generated', file, seconds: out.seconds, generatedAt: new Date().toISOString(), spokenText: spoken });
    save();
    made++;
    console.log(`ok    ${item.id}  ${out.seconds}s`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/\b429\b/.test(msg)) { console.log(`quota spent after ${made} new files. Run again later to continue.`); break; }
    console.log(`FAIL  ${item.id}  ${msg.slice(0, 160)}`);
  }
}
const left = catalog.items.filter((i) => !i.file).length;
console.log(`${made} generated now, ${left} still pending.`);
