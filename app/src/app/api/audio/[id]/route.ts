import { currentUser } from '@/lib/session';
import { data } from '@/lib/data';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return new Response('unauthorized', { status: 401 });
  const id = (await params).id;
  const a = await data.getAudio(id, user.id);
  if (!a) return new Response('not found or expired', { status: 404 });
  const download = new URL(req.url).searchParams.has('download');
  return new Response(Buffer.from(a.audio), {
    headers: {
      'Content-Type': a.mime,
      'Cache-Control': 'private, max-age=3600',
      ...(download ? { 'Content-Disposition': `attachment; filename="voice-${id.slice(0, 8)}.wav"` } : {}),
    },
  });
}
