import { cn } from '@/lib/cn';

const tones = {
  premium: 'bg-badge text-on-badge',
  neutral: 'bg-accent-soft text-on-accent-soft',
  success: 'bg-success-soft text-on-success-soft',
} as const;

export function Badge({ tone = 'neutral', children, className }: { tone?: keyof typeof tones; children: React.ReactNode; className?: string }) {
  return <span className={cn('inline-flex h-badge items-center rounded-pill px-8 text-xs font-semibold whitespace-nowrap', tones[tone], className)}>{children}</span>;
}
