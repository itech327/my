'use client';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { DIALECTS, type DialectCode } from '@/lib/dialects';
import { USE_CASE_LABELS, type UseCase, type Voice } from '@/lib/types';
import { ChipToggle } from '@/components/ui/Chip';
import { VoiceCard } from '@/components/VoiceCard';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export function VoiceLibrary({ voices, paid }: { voices: Voice[]; paid: boolean }) {
  const [dialect, setDialect] = useState<DialectCode | null>(null);
  const [use, setUse] = useState<UseCase | null>(null);
  const [gender, setGender] = useState<'female' | 'male' | null>(null);
  const [q, setQ] = useState('');
  const list = useMemo(() => voices.filter((v) =>
    (!dialect || v.dialect === dialect) && (!use || v.useCase === use) && (!gender || v.gender === gender) && (!q || v.name.includes(q.trim()))),
  [voices, dialect, use, gender, q]);
  const clear = () => { setDialect(null); setUse(null); setGender(null); setQ(''); };

  return (
    <div className="mx-auto grid max-w-wide gap-24">
      <div className="flex flex-wrap items-end justify-between gap-16">
        <div><h1 className="text-2xl">الأصوات</h1><p className="text-text-muted">{voices.length} صوتاً في {DIALECTS.length} لهجة</p></div>
        <div className="relative w-full max-w-sm">
          <label htmlFor="vq" className="sr-only">ابحث باسم الصوت</label>
          <Search className="pointer-events-none absolute start-12 top-1/2 size-icon -translate-y-1/2 text-text-muted" aria-hidden />
          <input id="vq" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث باسم الصوت"
            className="h-field w-full rounded-pill border border-border-input bg-surface ps-40 pe-16" />
        </div>
      </div>
      <div className="grid gap-12">
        <div className="flex gap-8 overflow-x-auto pb-4" role="group" aria-label="اللهجة">
          <ChipToggle pressed={!dialect} onClick={() => setDialect(null)}>كل اللهجات</ChipToggle>
          {DIALECTS.map((d) => <ChipToggle key={d.code} pressed={dialect === d.code} onClick={() => setDialect(d.code)}>{d.short}</ChipToggle>)}
        </div>
        <div className="flex flex-wrap gap-8" role="group" aria-label="الاستعمال والجنس">
          {(Object.keys(USE_CASE_LABELS) as UseCase[]).map((u) => (
            <ChipToggle key={u} pressed={use === u} onClick={() => setUse(use === u ? null : u)}>{USE_CASE_LABELS[u]}</ChipToggle>
          ))}
          <span className="mx-4 w-hairline self-stretch bg-border" aria-hidden />
          <ChipToggle pressed={gender === 'female'} onClick={() => setGender(gender === 'female' ? null : 'female')}>أنثى</ChipToggle>
          <ChipToggle pressed={gender === 'male'} onClick={() => setGender(gender === 'male' ? null : 'male')}>ذكر</ChipToggle>
        </div>
      </div>
      <p aria-live="polite" className="text-sm text-text-muted">{list.length} نتيجة</p>
      {list.length === 0 ? (
        <EmptyState icon={<Search className="size-avatar" />} title="لا صوت يطابق بحثك" help="جرّب لهجة أخرى أو امسح عوامل التصفية."
          action={<button type="button" onClick={clear} className="text-sm font-semibold underline">مسح التصفية</button>} />
      ) : (
        <div className="grid gap-16 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((v) => (
            <div key={v.id} className="grid gap-8">
              <VoiceCard voice={v} locked={v.isPremium && !paid} showDialect />
              <ButtonLink href={`/app?voice=${v.id}`} variant="secondary" size="sm">استعمل هذا الصوت</ButtonLink>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
