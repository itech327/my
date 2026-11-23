import { ArrowLeft, AudioLines, Mic, Wand2 } from 'lucide-react';
import { DIALECTS, type Dialect } from '@/lib/dialects';
import { data } from '@/lib/data';
import { ButtonLink } from './ui/Button';
import { ChipLink } from './ui/Chip';
import { Badge } from './ui/Badge';
import { Faq } from './ui/Faq';
import { VoiceCard } from './VoiceCard';

export async function Landing({ dialect }: { dialect?: Dialect }) {
  const voices = (await data.listVoices({ dialect: dialect?.code }))
    .filter((v, i, all) => !dialect ? all.findIndex((x) => x.dialect === v.dialect) === i : true)
    .slice(0, 6);
  const where = dialect ? dialect.name : 'لهجتك';
  const faq = [
    { q: dialect ? `هل يتقن ${dialect.name}؟` : 'ما اللهجات المتاحة؟',
      a: dialect ? `نعم. اختر ${dialect.name} ثم صوتاً من أصواتها، واكتب كما تتكلم.` : `ست عشرة لهجة إلى جانب الفصحى: ${DIALECTS.filter((d) => d.group !== 'fusha').map((d) => d.short).join('، ')}.` },
    { q: 'هل أحتاج إلى تشكيل النص؟', a: 'لا. التشكيل يساعد في الكلمات الملتبسة فقط، ولا يُحسب من رصيدك.' },
    { q: 'كيف أجرّب قبل الدفع؟', a: 'سجّل وتحصل على دقيقة مجانية دون بطاقة بنكية.' },
    { q: 'لمن تعود حقوق الصوت الناتج؟', a: 'لك. استعمله في الفيديو والإعلانات والبودكاست كما تشاء.' },
    { q: 'كم يبقى الملف محفوظاً؟', a: 'سبعة أيام من تاريخ إنشائه. نزّله قبل ذلك.' },
  ];

  return (
    <>
      <section className="mx-auto grid max-w-content justify-items-center gap-24 px-16 pb-64 pt-40 text-center md:pt-64">
        {dialect && <Badge>{dialect.country || 'العربية الفصحى'}</Badge>}
        <h1 className="text-2xl md:text-display">صوت طبيعي بـ{where}، من نصك في ثوانٍ</h1>
        <p className="max-w-prose text-lg font-normal text-text-muted">
          اكتب، اختر الصوت، واستمع. للفيديو والإعلانات والدروس والبودكاست.
        </p>
        <ButtonLink href="/signup" size="lg" icon={null}>جرّب مجاناً <ArrowLeft className="size-icon" aria-hidden /></ButtonLink>
        <p className="text-sm text-text-muted">دقيقة مجانية عند التسجيل · بلا بطاقة</p>
      </section>

      <section aria-labelledby="voices" className="mx-auto max-w-wide px-16 md:px-24">
        <h2 id="voices" className="mb-8 text-center text-2xl">استمع قبل أن تكتب</h2>
        <p className="mb-32 text-center text-text-muted">عيّنات من الأصوات{dialect ? ` بـ${dialect.name}` : ' في لهجات مختلفة'}.</p>
        <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
          {voices.map((v) => <VoiceCard key={v.id} voice={v} showDialect={!dialect} />)}
        </div>
      </section>

      <section aria-labelledby="dialects" className="mx-auto max-w-content px-16 pt-64 text-center">
        <h2 id="dialects" className="mb-24 text-2xl">سبع عشرة طريقة للكلام</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {DIALECTS.map((d) => <ChipLink key={d.code} href={`/${d.slug}`} current={d.code === dialect?.code}>{d.short}</ChipLink>)}
        </div>
      </section>

      <section aria-labelledby="features" className="mx-auto max-w-wide px-16 pt-64 md:px-24">
        <h2 id="features" className="sr-only">المزايا</h2>
        <div className="grid gap-16 md:grid-cols-3">
          <Feature icon={<Wand2 className="size-icon-lg" />} title="مشاعر على مستوى الكلمة"
            body="ظلّل جملة واجعلها همساً أو ضحكاً أو أسرع، داخل المقطع نفسه." sample="[همس]عندي ليك خبر[/همس] وما غاديش تصدقو" />
          <Feature icon={<Mic className="size-icon-lg" />} title="صوتك أنت" soon
            body="سجّل عيّنة قصيرة بموافقتك، واستعمل نسخة رقمية من صوتك في نصوصك." />
          <Feature icon={<AudioLines className="size-icon-lg" />} title="مؤثرات من وصف" soon
            body="اكتب «باب خشبي يُغلق ببطء» واحصل على المؤثر لمشهدك." />
        </div>
      </section>

      <section aria-labelledby="faq" className="mx-auto max-w-prose px-16 pt-64">
        <h2 id="faq" className="mb-16 text-2xl">أسئلة متكررة</h2>
        <Faq items={faq} />
      </section>
    </>
  );
}

function Feature({ icon, title, body, sample, soon }: { icon: React.ReactNode; title: string; body: string; sample?: string; soon?: boolean }) {
  return (
    <div className="grid content-start gap-8 rounded-lg border border-border bg-surface p-24">
      <div className="flex items-center gap-8"><span className="text-accent" aria-hidden>{icon}</span><h3 className="text-lg">{title}</h3>{soon && <Badge>قريباً</Badge>}</div>
      <p className="text-text-muted">{body}</p>
      {sample && <p className="rounded-md bg-surface-sunken p-12 text-sm" dir="auto">{sample}</p>}
    </div>
  );
}
