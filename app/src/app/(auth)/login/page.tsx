import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/session';
import { AuthForm } from '../AuthForm';

export const metadata: Metadata = { title: 'دخول' };
export default async function Login() {
  if (await currentUser()) redirect('/app');
  return <AuthForm mode="login" />;
}
