import { BookOpen, Film, GraduationCap, Lock, Megaphone, MessagesSquare, Podcast } from 'lucide-react';
import type { Voice, UseCase } from '@/lib/types';
import { USE_CASE_LABELS } from '@/lib/types';
import { dialectByCode } from '@/lib/dialects';
import { Badge } from './ui/Badge';
import { AudioPlayer } from './ui/AudioPlayer';
import { VoiceAvatar } from './VoiceAvatar';

const USE_ICON: Record<UseCase, typeof Film> = {
  documentary: Film, ads: Megaphone, education: GraduationCap, dialogue: MessagesSquare, podcast: Podcast, stories: BookOpen,
};

export function VoiceCard({ voice, locked, showDialect }: { voice: Voice; locked?: boolean; showDialect?: boolean }) {
  const Icon = USE_ICON[voice.useCase];
  return (
    <article className="rounded-lg border border-border bg-surface p-16 shadow-card transition hover:shadow-raised">
      <div className="mb-12 flex items-center gap-12">
        <VoiceAvatar id={voice.id} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-8">
            <h3 className="truncate text-lg">{voice.name}</h3>
            {voice.isPremium && <Badge tone="premium">مميّز</Badge>}
          </div>
          <p className="flex items-center gap-4 text-sm text-text-muted">
            <Icon className="size-icon-sm" aria-hidden />{USE_CASE_LABELS[voice.useCase]}
            {showDialect && <> · {dialectByCode(voice.dialect)?.short}</>}
          </p>
        </div>
        {locked && <Lock className="size-icon text-text-muted" aria-label="متاح في الباقات المدفوعة" />}
      </div>
      <AudioPlayer src={`/api/demo/${voice.id}`} label={`عيّنة ${voice.name}`} />
    </article>
  );
}
