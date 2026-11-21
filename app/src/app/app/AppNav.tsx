'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AudioLines, CreditCard, History, Mic, Settings, Users, Wand2 } from 'lucide-react';
import { BrandMark } from '@/components/ui/BrandMark';
import { cn } from '@/lib/cn';

const ITEMS = [
  { href: '/app', label: 'إنشاء صوت', icon: Wand2 },
  { href: '/app/voices', label: 'الأصوات', icon: Users },
  { href: '/app/history', label: 'السجل', icon: History },
  { href: '/app/clone', label: 'استنساخ صوتك', icon: Mic },
  { href: '/app/sfx', label: 'مؤثرات صوتية', icon: AudioLines },
  { href: '/app/billing', label: 'الرصيد والباقات', icon: CreditCard },
  { href: '/app/settings', label: 'الإعدادات', icon: Settings },
];

export function AppNav() {
  const path = usePathname();
  return (
    <div className="md:p-16">
      <div className="flex h-[var(--layout-header-height)] items-center px-16 md:mb-16 md:h-auto md:px-0">
        <Link href="/" aria-label="الصفحة الرئيسية"><BrandMark /></Link>
      </div>
      <nav aria-label="أقسام التطبيق" className="flex gap-4 overflow-x-auto px-16 pb-12 md:grid md:overflow-visible md:p-0">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const on = href === '/app' ? path === '/app' : path.startsWith(href);
          return (
            <Link key={href} href={href} aria-current={on ? 'page' : undefined}
              className={cn('flex h-control-md shrink-0 items-center gap-8 rounded-md px-12 text-sm font-medium whitespace-nowrap transition',
                on ? 'bg-ink text-on-ink' : 'text-text-muted hover:bg-surface-sunken hover:text-text')}>
              <Icon className="size-icon" aria-hidden />{label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
