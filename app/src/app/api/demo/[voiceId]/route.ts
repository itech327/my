import { data } from '@/lib/data';
import { getProvider } from '@/lib/tts';

// Public preview clips for voice cards. One fixed sentence, cached.
const SAMPLE = 'مرحباً، هذا مثال قصير على هذا الصوت وطريقته في الكلام.';

export async function GET(_: Request, { params }: { params: Promise<{ voiceId: string }> }) {
  const voice = await data.getVoice((await params).voiceId);
  if (!voice || voice.ownerId) return new Response('not found', { status: 404 });
  const out = await getProvider().synthesize({ voiceId: voice.id, dialect: voice.dialect, text: SAMPLE });
  return new Response(Buffer.from(out.audio), { headers: { 'Content-Type': out.mime, 'Cache-Control': 'public, max-age=86400' } });
}
