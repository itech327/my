import { useId, type ComponentProps } from 'react';
import { CircleAlert } from 'lucide-react';
import { cn } from '@/lib/cn';

type Props = ComponentProps<'input'> & { label: string; hint?: string; error?: string };

export function Field({ label, hint, error, className, id, ...rest }: Props) {
  const auto = useId();
  const fid = id ?? auto;
  const desc = error ? `${fid}-err` : hint ? `${fid}-hint` : undefined;
  return (
    <div className={cn('grid gap-4', className)}>
      <label htmlFor={fid} className="text-sm font-semibold">{label}</label>
      <input
        id={fid}
        aria-invalid={error ? true : undefined}
        aria-describedby={desc}
        className={cn('h-field w-full min-w-0 rounded-md border bg-surface px-12 text-base text-text placeholder:text-text-muted',
          error ? 'border-danger' : 'border-border-input')}
        {...rest}
      />
      {error ? (
        <p id={`${fid}-err`} className="flex items-center gap-4 text-sm text-danger"><CircleAlert className="size-icon-sm" aria-hidden />{error}</p>
      ) : hint ? (
        <p id={`${fid}-hint`} className="text-sm text-text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
