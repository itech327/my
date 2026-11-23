'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { CircleAlert, Lock, Sparkles } from 'lucide-react';
import { DIALECTS, GROUP_LABELS, dialectByCode, type DialectCode, type DialectGroup } from '@/lib/dialects';
import type { Balance, Generation, Voice } from '@/lib/types';
import { USE_CASE_LABELS } from '@/lib/types';
import { REGISTERS, DELIVERIES, PACES, TEMPLATES, registerById, deliveryById, type RegisterId, type DeliveryId, type PaceId } from '@/lib/delivery';
import { EMOTION_TAGS, MAX_CHARS_PER_REQUEST, countChars, estimateSeconds, formatBalance } from '@/lib/text';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChipToggle } from '@/components/ui/Chip';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { BalanceMeter } from '@/components/BalanceMeter';
import { VoiceAvatar } from '@/components/VoiceAvatar';
import { cn } from '@/lib/cn';

const GROUPS = Object.keys(GROUP_LABELS) as DialectGroup[];

export function Editor({ voices, initialBalance, paid, welcome, initialVoice, hasHistory }: {
  voices: Voice[]; initialBalance: Balance; paid: boolean; welcome?: string; initialVoice?: string; hasHistory: boolean;
}) {
  const start = voices.find((v) => v.id === initialVoice);
  const [dialect, setDialect] = useState<DialectCode>(start?.dialect ?? 'ar-MA');
  const options = useMemo(() => voices.filter((v) => v.dialect === dialect), [voices, dialect]);
  const [voiceId, setVoiceId] = useState(start?.id ?? options.find((v) => !v.isPremium || paid)?.id ?? '');
  const [text, setText] = useState('');
  const [delivery, setDelivery] = useState<DeliveryId>('conversational');
  const [pace, setPace] = useState<PaceId>('medium');
  const [register, setRegister] = useState<RegisterId>('darija');
  const [rewriting, setRewriting] = useState(false);
  const [beforeRewrite, setBeforeRewrite] = useState<string | null>(null);
  const pickDelivery = (d: DeliveryId) => { setDelivery(d); setPace(deliveryById(d)!.defaultPace); };
  const tone = deliveryById(delivery)!.tone;
  const [balance, setBalance] = useState(initialBalance);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Generation | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const chars = countChars(text);
  const secs = estimateSeconds(text);
  const tooLong = chars > MAX_CHARS_PER_REQUEST;
  const short = secs > balance.secondsLeft;
  const voice = voices.find((v) => v.id === voiceId);
  const canGenerate = !!voice && chars > 0 && !tooLong && !short && !busy;

  const changeDialect = (d: DialectCode) => {
    setDialect(d);
    const first = voices.find((v) => v.dialect === d && (!v.isPremium || paid));
    setVoiceId(first?.id ?? '');
  };

  const tag = (t: string) => {
    const el = area.current; if (!el) return;
    let { selectionStart: a, selectionEnd: b } = el;
    if (a === b) return;
    // snap to whole words so a tag never splits a word
    while (a > 0 && !/\s/.test(text[a - 1])) a--;
    while (b < text.length && !/\s/.test(text[b])) b++;
    while (a < b && /\s/.test(text[a])) a++;
    while (b > a && /\s/.test(text[b - 1])) b--;
    const next = `${text.slice(0, a)}[${t}]${text.slice(a, b)}[/${t}]${text.slice(b)}`;
    setText(next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(b + t.length * 2 + 5, b + t.length * 2 + 5); });
  };

  const generate = async () => {
    setBusy(true); setError(null);
    try {
      const r = await fetch('/api/generations', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ voiceId, dialect, text, delivery, pace, register: voice?.steerable ? register : undefined,
        style: voice?.styles?.includes(tone) ? tone : undefined }) });
      const j = await r.json();
      if (!r.ok) { setError(j.error ?? 'حدث خطأ، حاول مرة أخرى'); return; }
      setResult(j.generation); setBalance(j.balance);
      router.refresh(); // keep the sidebar balance in step
      if (j.generation.status === 'failed') setError('لم ننجح في إنشاء الصوت. لم يُخصم شيء من رصيدك.');
    } catch { setError('تعذّر الاتصال. تحقق من الإنترنت وحاول مجدداً.'); }
    finally { setBusy(false); }
  };

  const rewrite = async () => {
    setRewriting(true); setError(null);
    try {
      const r = await fetch('/api/rewrite', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text, register }) });
      const j = await r.json();
      if (!r.ok) { setError(j.error ?? 'تعذّر التحويل'); return; }
      setBeforeRewrite(text); setText(j.text);
    } catch { setError('تعذّر الاتصال. حاول مجدداً.'); }
    finally { setRewriting(false); }
  };

  return (
    <div className="mx-auto grid max-w-wide gap-24">
      {welcome === '1' && !hasHistory && (
        <p role="status" className="flex items-center gap-8 rounded-md bg-success-soft p-12 text-sm text-on-success-soft">
          <Sparkles className="size-icon" aria-hidden />أهلاً بك. أضفنا إلى رصيدك دقيقة مجانية لتجرّب.
        </p>
      )}
      {welcome === '0' && !hasHistory && (
        <p role="status" className="rounded-md bg-surface-sunken p-12 text-sm">هذا البريد استفاد من التجربة المجانية سابقاً. اختر باقة لتبدأ.</p>
      )}
      <div className="flex flex-wrap items-end justify-between gap-16">
        <h1 className="text-2xl">إنشاء صوت</h1>
        <div className="w-full md:hidden"><BalanceMeter balance={balance} compact /></div>
      </div>

      <div className="grid gap-24 lg:grid-cols-[1fr_var(--layout-card-min-width)]">
        <section aria-label="المحرر" className="grid content-start gap-16">
          <div className="flex flex-wrap items-center gap-8" role="group" aria-label="نماذج جاهزة">
            <span className="text-sm font-semibold">نماذج جاهزة:</span>
            {TEMPLATES.map((t) => (
              <Button key={t.id} type="button" variant="ghost" size="sm" onClick={() => { setText(t.text); pickDelivery(t.delivery); }}>{t.label}</Button>
            ))}
          </div>
          {voice?.steerable && (
            <fieldset className="grid gap-4">
              <legend className="mb-4 text-sm font-semibold">لغة الإلقاء</legend>
              <div className="flex flex-wrap gap-8">
                {REGISTERS.map((x) => <ChipToggle key={x.id} pressed={register === x.id} onClick={() => setRegister(x.id)}>{x.label}</ChipToggle>)}
              </div>
              <p className="text-xs text-text-muted">{registerById(register)?.hint}</p>
            </fieldset>
          )}
          {voice?.steerable && (
            <div className="flex flex-wrap items-center gap-8">
              <Button type="button" variant="secondary" size="sm" loading={rewriting} disabled={!text.trim() || rewriting} onClick={rewrite}>{register === 'fusha' ? 'حوّل إلى الفصحى' : 'حوّل إلى الدارجة'}</Button>
              {beforeRewrite !== null && (
                <Button type="button" variant="ghost" size="sm" onClick={() => { setText(beforeRewrite); setBeforeRewrite(null); }}>رجّع النص الأصلي</Button>
              )}
              <span className="text-xs text-text-muted">يعاود كتابة النص {register === 'fusha' ? 'بفصحى سليمة' : 'بالدارجة العامة'}، راجعه قبل الإنشاء.</span>
            </div>
          )}
          <div className="rounded-lg border border-border-input bg-surface focus-within:outline focus-within:outline-2 focus-within:outline-focus">
            <div role="toolbar" aria-label="المشاعر والسرعة" className="flex flex-wrap gap-4 border-b border-border p-8">
              {EMOTION_TAGS.map((t) => (
                <Button key={t.id} type="button" variant="secondary" size="sm" onMouseDown={(e) => e.preventDefault()} onClick={() => tag(t.id)}
                  title="ظلّل كلمات ثم اضغط">{t.label}</Button>
              ))}
              <span className="self-center px-8 text-xs text-text-muted">ظلّل جزءاً من النص ثم اختر</span>
            </div>
            <label htmlFor="text" className="sr-only">النص</label>
            <textarea id="text" ref={area} dir="auto" value={text} onChange={(e) => setText(e.target.value)}
              placeholder="اكتب هنا ما تريد أن تسمعه…"
              className="block min-h-editor-min w-full resize-y bg-transparent p-16 text-lg leading-loose outline-none" />
            <div className="flex flex-wrap items-center justify-between gap-12 border-t border-border px-16 py-12">
              <p aria-live="polite" className={cn('text-sm', tooLong || short ? 'text-danger' : 'text-text-muted')}>
                {chars} حرف · نحو {formatBalance(secs)}
                {tooLong && ` · الحد ${MAX_CHARS_PER_REQUEST} حرف`}
                {!tooLong && short && chars > 0 && <> · رصيدك لا يكفي. <Link href="/app/billing" className="underline">اشترِ دقائق</Link></>}
              </p>
              <Button onClick={generate} disabled={!canGenerate} loading={busy}>{busy ? (voice?.slow ? 'جارٍ الإنشاء… قد يأخذ دقيقة' : 'جارٍ الإنشاء') : 'إنشاء الصوت'}</Button>
            </div>
          </div>

          {error && <p role="alert" className="flex items-center gap-8 rounded-md bg-surface-sunken p-12 text-sm text-danger"><CircleAlert className="size-icon" aria-hidden />{error}</p>}

          {result?.status === 'done' && (
            <section aria-label="النتيجة" className="grid gap-8 rounded-lg border border-border bg-surface p-16">
              <div className="flex flex-wrap items-center justify-between gap-8 text-sm">
                <span className="font-semibold">{voice?.name} · {dialectByCode(result.dialect ?? '')?.short}</span>
                <span className="text-text-muted">خُصم {formatBalance(result.secondsCharged ?? 0)} · يبقى الملف ٧ أيام</span>
              </div>
              <AudioPlayer key={result.id} src={`/api/audio/${result.id}`} label="الصوت الناتج" downloadName={`voice-${result.id.slice(0, 8)}.wav`}
                initialDuration={result.secondsCharged ?? undefined} />
              {result.fallback && <p role="status" className="text-xs text-text-muted">لم يستجب Google، فتكلّم الصوت المجاني {result.fallback}.</p>}
              <Link href="/app/history" className="justify-self-start text-sm underline">كل ما أنشأته</Link>
            </section>
          )}
        </section>

        <aside aria-label="الصوت" className="grid content-start gap-16">
          <div className="grid gap-4">
            <label htmlFor="dialect" className="text-sm font-semibold">اللهجة</label>
            <select id="dialect" value={dialect} onChange={(e) => changeDialect(e.target.value as DialectCode)}
              className="h-field rounded-md border border-border-input bg-surface px-12">
              {GROUPS.map((g) => (
                <optgroup key={g} label={GROUP_LABELS[g]}>
                  {DIALECTS.filter((d) => d.group === g).map((d) => <option key={d.code} value={d.code}>{d.name}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <fieldset className="grid gap-8">
            <legend className="mb-4 text-sm font-semibold">الصوت</legend>
            {options.map((v) => {
              const locked = v.isPremium && !paid;
              return (
                <label key={v.id} className={cn('flex cursor-pointer items-center gap-12 rounded-md border bg-surface p-8 transition',
                  voiceId === v.id ? 'border-border-strong outline outline-1 outline-border-strong' : 'border-border hover:bg-surface-sunken',
                  locked && 'cursor-not-allowed opacity-60')}>
                  <input type="radio" name="voice" value={v.id} checked={voiceId === v.id} disabled={locked}
                    onChange={() => setVoiceId(v.id)} className="sr-only" />
                  <VoiceAvatar id={v.id} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-4 font-semibold">{v.name}{v.isPremium && <Badge tone="premium">مميّز</Badge>}</span>
                    <span className="block text-xs text-text-muted">{v.gender === 'female' ? 'أنثى' : 'ذكر'} · {USE_CASE_LABELS[v.useCase]}</span>
                  </span>
                  {locked && <Lock className="size-icon text-text-muted" aria-label="في الباقات المدفوعة" />}
                </label>
              );
            })}
            {options.length === 0 && <p className="text-sm text-text-muted">لا أصوات لهذه اللهجة بعد.</p>}
          </fieldset>
          <fieldset className="grid gap-4">
            <legend className="mb-4 text-sm font-semibold">أسلوب الإلقاء</legend>
            <div className="flex flex-wrap gap-8">
              {DELIVERIES.map((d) => <ChipToggle key={d.id} pressed={delivery === d.id} onClick={() => pickDelivery(d.id)}>{d.label}</ChipToggle>)}
            </div>
            <p className="text-xs text-text-muted">{deliveryById(delivery)!.hint}</p>
          </fieldset>
          <fieldset className="grid gap-4">
            <legend className="mb-4 text-sm font-semibold">السرعة</legend>
            <div className="flex flex-wrap gap-8">
              {PACES.map((p) => <ChipToggle key={p.id} pressed={pace === p.id} onClick={() => setPace(p.id)}>{p.label}</ChipToggle>)}
            </div>
          </fieldset>
          {voice && <AudioPlayer key={voice.id} src={`/api/demo/${voice.id}`} label={`عيّنة ${voice.name}`} />}
          {voice?.slow && <p className="rounded-md bg-surface-sunken p-8 text-xs text-text-muted">صوت بجودة استوديو. الإنشاء أبطأ: قد يأخذ دقيقة أو أكثر للفقرة.</p>}
          {!paid && <ButtonLink href="/app/billing" variant="secondary" size="sm">افتح الأصوات المميّزة</ButtonLink>}
          <div className="hidden md:block"><BalanceMeter balance={balance} /></div>
        </aside>
      </div>
    </div>
  );
}
