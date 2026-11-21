'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandMark } from './ui/BrandMark';
import { ButtonLink, buttonClass } from './ui/Button';

const LINKS = [
  { href: '/', label: 'الرئيسية' },
  { href: '/pricing', label: 'الأسعار' },
  { href: '/blog', label: 'المدونة' },
  { href: '/contact', label: 'اتصل بنا' },
];

export function TopNav({ signedIn }: { signedIn: boolean }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [open]);
  const isCurrent = (h: string) => (h === '/' ? path === '/' : path.startsWith(h));
  const account = signedIn
    ? <ButtonLink href="/app" size="sm">لوحة التحكم</ButtonLink>
    : <ButtonLink href="/login" size="sm">دخول</ButtonLink>;

  return (
    <header className="mx-auto flex h-[var(--layout-header-height)] max-w-wide items-center justify-between px-16 md:px-24">
      <Link href="/" aria-label="الصفحة الرئيسية"><BrandMark /></Link>
      <nav aria-label="القائمة الرئيسية" className="hidden items-center gap-4 rounded-pill border border-border bg-surface-sunken p-4 md:flex">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} aria-current={isCurrent(l.href) ? 'page' : undefined}
            className={buttonClass(isCurrent(l.href) ? 'ink' : 'ghost', 'sm')}>{l.label}</Link>
        ))}
      </nav>
      <div className="hidden md:block">{account}</div>
      <button type="button" className={buttonClass('ghost', 'sm', 'md:hidden')} aria-expanded={open} aria-controls="mobile-nav"
        aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'} onClick={() => setOpen(!open)}>
        {open ? <X className="size-icon-lg" aria-hidden /> : <Menu className="size-icon-lg" aria-hidden />}
      </button>
      {open && (
        <nav id="mobile-nav" aria-label="القائمة" className="absolute inset-x-0 top-[var(--layout-header-height)] z-10 grid gap-4 border-b border-border bg-surface p-16 shadow-pop md:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={isCurrent(l.href) ? 'page' : undefined}
              className={buttonClass(isCurrent(l.href) ? 'ink' : 'ghost', 'md', 'justify-start')}>{l.label}</Link>
          ))}
          <div className="pt-8">{account}</div>
        </nav>
      )}
    </header>
  );
}
