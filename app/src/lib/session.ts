import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { data } from './data';
import type { User } from './types';

export const SESSION_COOKIE = 'sid';

export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? data.userForSession(token) : null;
}

export async function requireUser(): Promise<User> {
  const u = await currentUser();
  if (!u) redirect('/login');
  return u;
}

export async function startSession(userId: string) {
  const token = await data.createSession(userId);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30,
  });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await data.endSession(token);
  jar.delete(SESSION_COOKIE);
}
