import { requireUser } from '@/lib/session';
import { data } from '@/lib/data';
import { AppNav } from './AppNav';
import { BalanceMeter } from '@/components/BalanceMeter';
import { logout } from '../(auth)/actions';
import { LogOut } from 'lucide-react';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const balance = await data.getBalance(user.id);
  return (
    <div className="min-h-screen md:grid md:grid-cols-[var(--size-sidebar)_1fr]">
      <aside className="border-b border-border bg-surface md:sticky md:top-0 md:flex md:h-screen md:flex-col md:border-b-0 md:border-e">
        <AppNav />
        <div className="hidden gap-16 border-t border-border p-16 md:mt-auto md:grid">
          <BalanceMeter balance={balance} compact />
          <div className="flex items-center justify-between gap-8 text-sm">
            <span className="truncate text-text-muted" dir="ltr" title={user.email}>{user.email}</span>
            <form action={logout}><button type="submit" className="text-text-muted hover:text-text" aria-label="خروج"><LogOut className="size-icon" aria-hidden /></button></form>
          </div>
        </div>
      </aside>
      <main id="main" className="min-w-0 px-16 py-24 md:px-32 md:py-32">{children}</main>
    </div>
  );
}
