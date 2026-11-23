import type { Metadata } from 'next';
import { requireUser } from '@/lib/session';
import { data } from '@/lib/data';
import { PLANS, planById } from '@/lib/plans';
import { PlanCard } from '@/components/PlanCard';
import { BalanceMeter } from '@/components/BalanceMeter';
import { Button } from '@/components/ui/Button';
import { buyPlan } from './actions';

export const metadata: Metadata = { title: 'الرصيد والباقات' };

export default async function Billing({ searchParams }: { searchParams: Promise<{ bought?: string; plan?: string }> }) {
  const user = await requireUser();
  const sp = await searchParams;
  const balance = await data.getBalance(user.id);
  const bought = sp.bought ? planById(sp.bought) : undefined;
  return (
    <div className="mx-auto grid max-w-wide gap-32">
      <div><h1 className="text-2xl">الرصيد والباقات</h1></div>
      {bought && <p role="status" className="rounded-md bg-success-soft p-12 text-sm text-on-success-soft">أضفنا باقة «{bought.name}» إلى رصيدك.</p>}
      <p role="note" className="rounded-md border border-warning p-12 text-sm">وضع التجربة: الشراء هنا لا يطلب دفعاً ويضيف الدقائق مباشرة. يُستبدل ببوابة الدفع لاحقاً.</p>
      <section className="max-w-md rounded-lg border border-border bg-surface p-16" aria-label="رصيدك"><BalanceMeter balance={balance} /></section>
      <section aria-labelledby="plans">
        <h2 id="plans" className="mb-24 text-xl">الباقات</h2>
        <div className="grid gap-24 pt-12 sm:grid-cols-2 xl:grid-cols-4">
          {PLANS.filter((p) => p.priceUsd > 0).map((p) => (
            <PlanCard key={p.id} plan={p} action={
              <form action={buyPlan}><input type="hidden" name="plan" value={p.id} />
                <Button type="submit" className="w-full" variant={sp.plan === p.id ? 'ink' : p.highlight ? 'ink' : 'secondary'}>أضف {p.name}</Button>
              </form>} />
          ))}
        </div>
      </section>
    </div>
  );
}
