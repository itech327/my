import { getAudio } from '@/lib/mcp-audio';

// Public by link: the id is 144 random bits and expires after 7 days.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const a = /^[A-Za-z0-9_-]{24}$/.test(id) ? getAudio(id) : null;
  if (!a) return new Response('not found or expired', { status: 404 });
  return new Response(Buffer.from(a.audio), {
    headers: {
      'Content-Type': a.mime,
      'Cache-Control': 'private, max-age=3600',
      'Content-Disposition': `inline; filename="sada-${id.slice(0, 8)}.wav"`,
      'X-Robots-Tag': 'noindex',
    },
  });
}
