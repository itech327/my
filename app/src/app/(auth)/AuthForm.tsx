'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { BrandMark } from '@/components/ui/BrandMark';
import { login, signup, type AuthState } from './actions';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(mode === 'login' ? login : signup, undefined);
  const isSignup = mode === 'signup';
  return (
    <main id="main" className="flex min-h-screen items-center justify-center px-16 py-40">
      <div className="grid w-full max-w-sm gap-24">
        <Link href="/" className="justify-self-center" aria-label="الرئيسية"><BrandMark /></Link>
        <div className="rounded-lg border border-border bg-surface p-24 shadow-card">
          <h1 className="mb-4 text-xl">{isSignup ? 'أنشئ حسابك' : 'مرحباً بعودتك'}</h1>
          <p className="mb-24 text-sm text-text-muted">{isSignup ? 'دقيقة مجانية تنتظرك بعد التسجيل.' : 'ادخل لتكمل من حيث توقفت.'}</p>
          <form action={action} className="grid gap-16" noValidate>
            <Field label="البريد الإلكتروني" name="email" type="email" dir="ltr" autoComplete="email" required defaultValue={state?.email} />
            <Field label="كلمة المرور" name="password" type="password" dir="ltr" required minLength={8}
              autoComplete={isSignup ? 'new-password' : 'current-password'} hint={isSignup ? '٨ أحرف على الأقل' : undefined} />
            {state?.error && <p role="alert" className="rounded-md bg-surface-sunken p-12 text-sm text-danger">{state.error}</p>}
            <Button type="submit" loading={pending} className="w-full">{isSignup ? 'إنشاء الحساب' : 'دخول'}</Button>
          </form>
        </div>
        <p className="text-center text-sm text-text-muted">
          {isSignup ? <>لديك حساب؟ <Link href="/login" className="font-semibold text-text underline">ادخل</Link></>
            : <>جديد هنا؟ <Link href="/signup" className="font-semibold text-text underline">أنشئ حساباً</Link></>}
        </p>
      </div>
    </main>
  );
}
