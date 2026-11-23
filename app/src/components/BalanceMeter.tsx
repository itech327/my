import Link from 'next/link';
import type { Balance } from '@/lib/types';
import { formatBalance } from '@/lib/text';
import { cn } from '@/lib/cn';

export function BalanceMeter({ balance, compact }: { balance: Balance; compact?: boolean }) {
  const s = balance.secondsLeft;
  const tone = s === 0 ? 'danger' : s < 60 ? 'warning' : 'ok';
  const pct = Math.min(100, Math.round((s / 1800) * 100));
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-8 text-sm">
        <span className="font-semibold">الرصيد</span>
        <span className={cn(tone === 'danger' && 'text-danger', tone === 'warning' && 'text-warning')}>
          {s === 0 ? 'نفد الرصيد' : formatBalance(s)}{tone === 'warning' && ' · منخفض'}
        </span>
      </div>
      <div className="h-8 overflow-hidden rounded-pill bg-surface-sunken" role="meter" aria-label="الرصيد المتبقي"
        aria-valuemin={0} aria-valuemax={1800} aria-valuenow={Math.min(s, 1800)} aria-valuetext={formatBalance(s)}>
        <div className={cn('h-full', tone === 'ok' ? 'bg-ink' : tone === 'warning' ? 'bg-warning' : 'bg-danger')} style={{ width: `${pct}%` }} />
      </div>
      {!compact && (
        <div className="flex justify-between text-xs text-text-muted">
          <span>{balance.nextExpiry ? `ينتهي جزء منه في ${new Date(balance.nextExpiry).toLocaleDateString('ar')}` : 'بلا تاريخ انتهاء'}</span>
          <Link href="/app/billing" className="font-semibold text-text underline">شراء دقائق</Link>
        </div>
      )}
    </div>
  );
}
