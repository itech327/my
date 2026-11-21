import type { Metadata } from 'next';
import { PLANS } from '@/lib/plans';
import { PlanCard } from '@/components/PlanCard';
import { ButtonLink } from '@/components/ui/Button';
import { Faq } from '@/components/ui/Faq';
import { currentUser } from '@/lib/session';

export const metadata: Metadata = { title: 'الأسعار', description: 'باقات بالدقيقة، بلا مفاجآت. دقيقة مجانية للتجربة.' };

export default async function Pricing() {
  const user = await currentUser();
  const paid = PLANS.filter((p) => p.priceUsd > 0);
  const free = PLANS.find((p) => p.priceUsd === 0)!;
  const ref = paid[0].priceUsd / paid[0].seconds;
  const saving = (p: (typeof PLANS)[number]) => Math.round((1 - p.priceUsd / p.seconds / ref) * 100);
  const href = (id: string) => (user ? `/app/billing?plan=${id}` : `/signup?plan=${id}`);

  return (
    <div className="mx-auto max-w-wide px-16 pt-40 md:px-24">
      <h1 className="text-center text-2xl md:text-display">ادفع على قدر ما تسمع</h1>
      <p className="mx-auto mb-40 mt-8 max-w-prose text-center text-lg font-normal text-text-muted">كل الباقات فيها كل المزايا. الفرق في عدد الدقائق ومدتها.</p>
      <div className="grid gap-24 pt-12 sm:grid-cols-2 xl:grid-cols-4">
        {paid.map((p) => (
          <PlanCard key={p.id} plan={p} savingPct={saving(p) > 0 ? saving(p) : undefined}
            action={<ButtonLink href={href(p.id)} className="w-full">اختر {p.name}</ButtonLink>} />
        ))}
      </div>
      <div className="mx-auto mt-40 max-w-sm">
        <PlanCard plan={free} action={<ButtonLink href={user ? '/app' : '/signup'} variant="secondary" className="w-full">ابدأ التجربة</ButtonLink>} />
      </div>
      <section className="mx-auto max-w-prose pt-64" aria-labelledby="pfaq">
        <h2 id="pfaq" className="mb-16 text-2xl">عن الدفع</h2>
        <Faq items={[
          { q: 'ماذا يحدث للدقائق التي لم أستعملها؟', a: 'إذا جدّدت قبل نهاية المدة تنتقل كلها إلى الباقة الجديدة.' },
          { q: 'هل يمكنني الإلغاء؟', a: 'نعم، بضغطة واحدة من صفحة الفوترة. تبقى دقائقك صالحة حتى نهاية المدة.' },
          { q: 'كيف يُحسب الاستهلاك؟', a: 'بالثانية من الصوت الناتج. التشكيل والوسوم لا تُحسب.' },
          { q: 'هل أدفع بعملتي؟', a: 'قريباً: الدرهم والريال والجنيه إلى جانب الدولار.' },
        ]} />
      </section>
    </div>
  );
}
