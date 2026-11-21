import Link from 'next/link';
import { cn } from '@/lib/cn';

const cls = (on?: boolean) =>
  cn('inline-flex h-chip items-center rounded-pill border px-16 text-sm font-medium whitespace-nowrap transition',
    on ? 'bg-ink text-on-ink border-ink' : 'bg-surface text-text border-border hover:bg-surface-sunken');

export function ChipLink({ href, children, current }: { href: string; children: React.ReactNode; current?: boolean }) {
  return <Link href={href} className={cls(current)} aria-current={current ? 'page' : undefined}>{children}</Link>;
}

export function ChipToggle({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" className={cls(pressed)} aria-pressed={pressed} onClick={onClick}>{children}</button>;
}
