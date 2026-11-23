import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'ink' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-8 rounded-pill border font-semibold whitespace-nowrap transition ' +
  'duration-150 active:scale-[.98] disabled:opacity-40 disabled:pointer-events-none aria-disabled:opacity-40 aria-disabled:pointer-events-none';
const variants: Record<Variant, string> = {
  ink: 'bg-ink text-on-ink border-ink hover:opacity-90',
  secondary: 'bg-surface text-text border-border hover:bg-surface-sunken',
  ghost: 'bg-transparent text-text-muted border-transparent hover:text-text hover:bg-surface-sunken',
  danger: 'bg-danger text-on-ink border-danger hover:opacity-90',
};
const sizes: Record<Size, string> = {
  sm: 'h-control-sm px-16 text-sm',
  md: 'h-control-md px-24 text-sm',
  lg: 'h-control-lg px-40 text-lg',
};

export function buttonClass(variant: Variant = 'ink', size: Size = 'md', extra?: string) {
  return cn(base, variants[variant], sizes[size], extra);
}

type BtnProps = ComponentProps<'button'> & { variant?: Variant; size?: Size; loading?: boolean; icon?: ReactNode };

export function Button({ variant, size, loading, icon, className, children, disabled, ...rest }: BtnProps) {
  return (
    <button className={buttonClass(variant, size, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <Loader2 className="size-icon animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
}

type LinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size; icon?: ReactNode };

export function ButtonLink({ variant, size, icon, className, children, ...rest }: LinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      {icon}
      {children}
    </Link>
  );
}
