import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/session';
import { data } from '@/lib/data';
import { runGeneration, STATUS_FOR } from '@/lib/generate';
import type { DeliveryId, PaceId } from '@/lib/delivery';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const orig = await data.getGeneration((await params).id, user.id);
  if (!orig || !orig.voiceId || !orig.dialect) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const res = await runGeneration({ userId: user.id, voiceId: orig.voiceId, dialect: orig.dialect, text: orig.inputText, regeneratedFrom: orig.id, style: orig.style ?? undefined,
    delivery: (orig.delivery ?? undefined) as DeliveryId | undefined, pace: (orig.pace ?? undefined) as PaceId | undefined });
  if (!res.ok) return NextResponse.json({ error: res.error, code: res.code }, { status: STATUS_FOR[res.code] ?? 400 });
  return NextResponse.json({ generation: res.value, balance: await data.getBalance(user.id) }, { status: 201 });
}
