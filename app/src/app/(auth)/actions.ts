'use server';
import { redirect } from 'next/navigation';
import { data } from '@/lib/data';
import { endSession, startSession } from '@/lib/session';

export type AuthState = { error?: string; email?: string } | undefined;

export async function signup(_: AuthState, form: FormData): Promise<AuthState> {
  const email = String(form.get('email') ?? '');
  const res = await data.createUser(email, String(form.get('password') ?? ''));
  if (!res.ok) return { error: res.error, email };
  await startSession(res.value.id);
  const granted = await data.claimTrial(res.value.id);
  redirect(granted ? '/app?welcome=1' : '/app?welcome=0');
}

export async function login(_: AuthState, form: FormData): Promise<AuthState> {
  const email = String(form.get('email') ?? '');
  const res = await data.verifyUser(email, String(form.get('password') ?? ''));
  if (!res.ok) return { error: res.error, email };
  await startSession(res.value.id);
  redirect('/app');
}

export async function logout() {
  await endSession();
  redirect('/');
}
