import Link from 'next/link';
import { DIALECTS } from '@/lib/dialects';
import { BRAND } from '@/lib/brand';
import { BrandMark } from './ui/BrandMark';

export function Footer() {
  return (
    <footer className="mt-80 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-wide gap-32 px-16 py-40 md:grid-cols-3 md:px-24">
        <div className="grid content-start gap-8">
          <BrandMark />
          <p className="text-sm text-text-muted">{BRAND.tagline}</p>
        </div>
        <nav aria-label="اللهجات" className="md:col-span-1">
          <p className="mb-8 text-sm font-semibold">اللهجات</p>
          <ul className="flex flex-wrap gap-x-12 gap-y-4 text-sm text-text-muted">
            {DIALECTS.map((d) => <li key={d.code}><Link className="hover:text-text" href={`/${d.slug}`}>{d.short}</Link></li>)}
          </ul>
        </nav>
        <nav aria-label="روابط" className="text-sm text-text-muted">
          <p className="mb-8 font-semibold text-text">الموقع</p>
          <ul className="grid gap-4">
            <li><Link className="hover:text-text" href="/about">عن المشروع</Link></li>
            <li><Link className="hover:text-text" href="/pricing">الأسعار</Link></li>
            <li><Link className="hover:text-text" href="/terms">الشروط</Link></li>
            <li><Link className="hover:text-text" href="/privacy">الخصوصية</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
