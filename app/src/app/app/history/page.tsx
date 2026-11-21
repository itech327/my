import type { Metadata } from 'next';
import { History as HistoryIcon } from 'lucide-react';
import { requireUser } from '@/lib/session';
import { data } from '@/lib/data';
import { dialectByCode } from '@/lib/dialects';
import { formatBalance, plainText } from '@/lib/text';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { RegenerateButton } from './RegenerateButton';

export const metadata: Metadata = { title: 'السجل' };

const daysLeft = (iso: string) => Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 864e5));

export default async function HistoryPage() {
  const user = await requireUser();
  const [gens, voices] = await Promise.all([data.listGenerations(user.id), data.listVoices({ userId: user.id })]);
  const name = (id: string | null) => voices.find((v) => v.id === id)?.name ?? 'صوت محذوف';

  return (
    <div className="mx-auto grid max-w-content gap-24">
      <div><h1 className="text-2xl">السجل</h1><p className="text-text-muted">تُحذف الملفات ونصوصها بعد ٧ أيام من إنشائها.</p></div>
      {gens.length === 0 ? (
        <EmptyState icon={<HistoryIcon className="size-avatar" />} title="لم تنشئ شيئاً بعد" help="أول صوت تنشئه سيظهر هنا."
          action={<ButtonLink href="/app" size="sm">أنشئ صوتاً</ButtonLink>} />
      ) : (
        <ol className="grid gap-12">
          {gens.map((g) => (
            <li key={g.id} className="grid gap-12 rounded-lg border border-border bg-surface p-16">
              <div className="flex flex-wrap items-start justify-between gap-8">
                <p className="line-clamp-2 min-w-0 flex-1" dir="auto">{g.status === 'expired' ? <span className="text-text-muted">انتهت مدة الحفظ</span> : plainText(g.inputText)}</p>
                {g.status === 'failed' && <Badge>فشل · أُعيد الرصيد</Badge>}
                {g.isFreeRegen && <Badge tone="success">إعادة مجانية</Badge>}
              </div>
              <p className="text-xs text-text-muted">
                {name(g.voiceId)} · {dialectByCode(g.dialect ?? '')?.short} · {new Date(g.createdAt).toLocaleString('ar')}
                {g.secondsCharged != null && ` · خُصم ${formatBalance(g.secondsCharged)}`}
                {g.status === 'done' && ` · يُحذف بعد ${daysLeft(g.expiresAt)} أيام`}
              </p>
              {g.status === 'done' && (
                <div className="flex flex-wrap items-center gap-8">
                  <AudioPlayer className="min-w-0 flex-1" src={`/api/audio/${g.id}`} label={`تسجيل ${name(g.voiceId)}`} downloadName={`voice-${g.id.slice(0, 8)}.wav`} />
                  {!g.regeneratedFrom && <RegenerateButton id={g.id} />}
                </div>
              )}
              {g.status === 'failed' && g.error && <p className="text-sm text-danger">{g.error}</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
