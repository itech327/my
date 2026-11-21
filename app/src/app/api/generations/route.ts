import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/session';
import { data } from '@/lib/data';
import { runGeneration, STATUS_FOR } from '@/lib/generate';
import { dialectByCode } from '@/lib/dialects';

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json({ generations: await data.listGenerations(user.id) });
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول أولاً' }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { voiceId?: unknown; dialect?: unknown; text?: unknown; style?: unknown } | null;
  if (!body || typeof body.voiceId !== 'string' || typeof body.text !== 'string' || typeof body.dialect !== 'string' || !dialectByCode(body.dialect))
    return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 });
  const res = await runGeneration({ userId: user.id, voiceId: body.voiceId, dialect: dialectByCode(body.dialect)!.code, text: body.text,
    style: body.style === 'lively' || body.style === 'calm' ? body.style : undefined });
  if (!res.ok) return NextResponse.json({ error: res.error, code: res.code }, { status: STATUS_FOR[res.code] ?? 400 });
  return NextResponse.json({ generation: res.value, balance: await data.getBalance(user.id) }, { status: 201 });
}
