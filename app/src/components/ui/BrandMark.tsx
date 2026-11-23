import { BRAND } from '@/lib/brand';

// Placeholder mark: three sound bars. /replica-brand replaces it.
export function BrandMark() {
  return (
    <span className="inline-flex items-center gap-8 text-lg font-bold">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden className="text-accent">
        <rect width="28" height="28" rx="8" fill="currentColor" />
        <rect x="7" y="10" width="3" height="8" rx="1.5" fill="white" />
        <rect x="12.5" y="6" width="3" height="16" rx="1.5" fill="white" />
        <rect x="18" y="9" width="3" height="10" rx="1.5" fill="white" />
      </svg>
      {BRAND.name}
    </span>
  );
}
