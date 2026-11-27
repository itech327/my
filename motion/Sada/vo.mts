// Makes the voiceover lines of the Sada ad with Younes (Gemini, our designed voice) through the app's own text front end.
// Run from motion/Sada:  NODE_USE_ENV_PROXY=1 npx --prefix ../../app tsx vo.mts
import { writeFileSync } from 'node:fs';
import { geminiStyle } from '../../app/src/lib/delivery';
import { normalizeDarija } from '../../app/src/lib/darija-normalize';
import { designedVoice, geminiSpeak } from '../../app/src/lib/tts/gemini';

const LINES: Record<string, string> = {
  'vo-1': 'كتب النص ديالك، واختار الصوت.',
  'vo-2': 'صدى: كيهضر بالدارجة وبالفصحى.',
};
const apiKey = process.env.GEMINI_API_KEY ?? 'proxy-injected';
for (const [name, text] of Object.entries(LINES)) {
  const out = await geminiSpeak({ text: normalizeDarija(text, { profile: 'gemini' }), apiKey, voice: designedVoice('darija', 'male', 'Charon'), style: geminiStyle('conversational', 'medium', 'darija') });
  writeFileSync(`sounds/${name}.wav`, out.audio);
  console.log(name, `${out.seconds}s`, text);
}
