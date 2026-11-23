import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/session';
import { AuthForm } from '../AuthForm';

export const metadata: Metadata = { title: 'إنشاء حساب' };
export default async function Signup() {
  if (await currentUser()) redirect('/app');
  return <AuthForm mode="signup" />;
}
