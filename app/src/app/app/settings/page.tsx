import type { Metadata } from 'next';
import { KeyRound } from 'lucide-react';
import { requireUser } from '@/lib/session';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { DeleteAccount } from './DeleteAccount';

export const metadata: Metadata = { title: 'الإعدادات' };

export default async function Settings() {
  const user = await requireUser();
  return (
    <div className="mx-auto grid max-w-content gap-32">
      <h1 className="text-2xl">الإعدادات</h1>
      <section aria-labelledby="acc" className="grid gap-8 rounded-lg border border-border bg-surface p-24">
        <h2 id="acc" className="text-xl">الحساب</h2>
        <p className="text-sm text-text-muted">البريد الإلكتروني</p>
        <p dir="ltr" className="break-all text-start">{user.email}</p>
        <p className="text-sm text-text-muted">منذ {new Date(user.createdAt).toLocaleDateString('ar')}</p>
      </section>
      <section aria-labelledby="api" className="grid gap-16 rounded-lg border border-border bg-surface p-24">
        <div className="flex items-center gap-8"><h2 id="api" className="text-xl">مفاتيح الواجهة البرمجية</h2><Badge>قريباً</Badge></div>
        <EmptyState icon={<KeyRound className="size-avatar" />} title="لا مفاتيح بعد" help="ستتمكن من إنشاء مفاتيح لاستعمال الخدمة من تطبيقاتك." />
      </section>
      <section aria-labelledby="del" className="grid gap-12 rounded-lg border border-danger bg-surface p-24">
        <h2 id="del" className="text-xl text-danger">حذف الحساب</h2>
        <p className="text-sm text-text-muted">يُحذف السجل والملفات والرصيد المتبقي ولا يمكن استرجاعها. نزّل ما تريد الاحتفاظ به أولاً.</p>
        <DeleteAccount />
      </section>
    </div>
  );
}
