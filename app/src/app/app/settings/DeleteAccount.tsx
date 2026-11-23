'use client';
import { useActionState } from 'react';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { deleteAccount } from './actions';

export function DeleteAccount() {
  const [error, action, pending] = useActionState(deleteAccount, undefined);
  return (
    <form action={action} className="grid max-w-sm gap-12">
      <Field label="اكتب «احذف» للتأكيد" name="confirm" autoComplete="off" error={error} />
      <Button type="submit" variant="danger" loading={pending} className="justify-self-start">حذف الحساب نهائياً</Button>
    </form>
  );
}
