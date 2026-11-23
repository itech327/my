import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/session';
import { data } from '@/lib/data';
import { dialectByCode } from '@/lib/dialects';

export async function GET(req: Request) {
  const user = await currentUser();
  const d = new URL(req.url).searchParams.get('dialect');
  const dialect = d ? dialectByCode(d)?.code : undefined;
  return NextResponse.json({ voices: await data.listVoices({ dialect, userId: user?.id }) });
}
