'use server';
import { redirect } from 'next/navigation';
import { requireUser, endSession } from '@/lib/session';
import { data } from '@/lib/data';

export async function deleteAccount(_: string | undefined, form: FormData): Promise<string | undefined> {
  const user = await requireUser();
  if (String(form.get('confirm') ?? '').trim() !== 'احذف') return 'اكتب كلمة «احذف» للتأكيد';
  await data.deleteUser(user.id);
  await endSession();
  redirect('/?deleted=1');
}
