import { Check } from 'lucide-react';
import type { Plan } from '@/lib/types';
import { formatBalance } from '@/lib/text';
import { cn } from '@/lib/cn';
import { Badge } from './ui/Badge';

const PERIOD: Record<number, string> = { 1: 'شهرياً', 3: 'كل ٣ أشهر', 6: 'كل ٦ أشهر' };
const FEATURES = ['كل اللهجات والأصوات', 'وسوم المشاعر والسرعة', 'تنزيل بجودة عالية', 'استخدام تجاري'];

export function PlanCard({ plan, action, current, savingPct }: { plan: Plan; action: React.ReactNode; current?: boolean; savingPct?: number }) {
  const free = plan.priceUsd === 0;
  return (
    <section
      aria-labelledby={`plan-${plan.id}`}
      className={cn('relative flex flex-col rounded-lg border bg-surface px-24 pb-24 pt-32 transition hover:shadow-raised',
        free ? 'border-border' : 'border-border-strong', plan.highlight && 'shadow-raised')}
    >
      <h3 id={`plan-${plan.id}`}
        className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-pill bg-ink px-16 text-sm font-bold text-on-ink">
        {plan.name}
      </h3>
      <p className="text-center">
        <span className="text-2xl" dir="ltr">${plan.priceUsd}</span>{' '}
        {!free && <span className="text-sm text-text-muted">{PERIOD[plan.periodMonths]}</span>}
      </p>
      <ul className="my-16 grid gap-8 text-sm">
        <li className="flex items-center gap-8 font-bold"><Tick />{formatBalance(plan.seconds)} من الصوت</li>
        {(free ? FEATURES.slice(0, 1) : FEATURES).map((f) => <li key={f} className="flex items-center gap-8"><Tick />{f}</li>)}
      </ul>
      {!free && <p className="text-xs text-text-muted">الدقائق غير المستعملة تنتقل معك عند التجديد.</p>}
      <div className="mt-auto grid gap-12 pt-16">
        {current ? <Badge tone="success" className="justify-self-center">باقتك الحالية</Badge>
          : savingPct ? <Badge tone="success" className="justify-self-center">توفير {savingPct}٪ للدقيقة</Badge> : null}
        {action}
      </div>
    </section>
  );
}

function Tick() {
  return <span className="grid size-icon-lg shrink-0 place-items-center rounded-pill bg-success-soft text-on-success-soft"><Check className="size-icon-sm" aria-hidden /></span>;
}
