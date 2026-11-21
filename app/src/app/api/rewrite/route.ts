import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/session';
import { rewriteToDarija } from '@/lib/darija-rewrite';
import { accentById } from '@/lib/delivery';

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول أولاً' }, { status: 401 });
  if (process.env.TTS_GEMINI !== '1') return NextResponse.json({ error: 'التحويل إلى الدارجة غير مفعّل' }, { status: 503 });
  const body = (await req.json().catch(() => null)) as { text?: unknown; accent?: unknown } | null;
  const text = typeof body?.text === 'string' ? body.text.trim() : '';
  if (!text) return NextResponse.json({ error: 'اكتب نصاً أولاً' }, { status: 400 });
  if (text.length > 2000) return NextResponse.json({ error: 'النص أطول من ٢٠٠٠ حرف' }, { status: 400 });
  try {
    return NextResponse.json({ text: await rewriteToDarija(text, accentById(String(body?.accent ?? ''))?.id) });
  } catch {
    return NextResponse.json({ error: 'تعذّر التحويل الآن، حاول بعد قليل' }, { status: 502 });
  }
}
