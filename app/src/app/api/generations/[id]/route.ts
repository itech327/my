import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/session';
import { data } from '@/lib/data';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const gen = await data.getGeneration((await params).id, user.id);
  return gen ? NextResponse.json({ generation: gen }) : NextResponse.json({ error: 'not found' }, { status: 404 });
}
