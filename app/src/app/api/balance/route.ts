import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/session';
import { data } from '@/lib/data';

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json(await data.getBalance(user.id));
}
