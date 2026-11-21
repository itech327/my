import { data } from '@/lib/data';
import { getProvider } from '@/lib/tts';

// Public preview clips for voice cards. One fixed sentence, cached.
const SAMPLE = 'سلام، هادا مثال قصير على هاد الصوت وكيفاش كيهضر.';

// One sample per voice, kept in memory: paid engines (Gemini) are called once, not on every play.
const g = globalThis as unknown as { __demoCache?: Map<string, { audio: Uint8Array; mime: string }> };
const cache = (g.__demoCache ??= new Map());

export async function GET(_: Request, { params }: { params: Promise<{ voiceId: string }> }) {
  const voice = await data.getVoice((await params).voiceId);
  if (!voice || voice.ownerId) return new Response('not found', { status: 404 });
  const hit = cache.get(voice.id);
  if (hit) return new Response(Buffer.from(hit.audio), { headers: { 'Content-Type': hit.mime, 'Cache-Control': 'public, max-age=86400' } });
  const out = await getProvider().synthesize({ voiceId: voice.id, dialect: voice.dialect, text: SAMPLE });
  cache.set(voice.id, { audio: out.audio, mime: out.mime });
  return new Response(Buffer.from(out.audio), { headers: { 'Content-Type': out.mime, 'Cache-Control': 'public, max-age=86400' } });
}
