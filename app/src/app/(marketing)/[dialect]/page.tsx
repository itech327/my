import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Landing } from '@/components/Landing';
import { DIALECTS, dialectBySlug } from '@/lib/dialects';

export const dynamicParams = false;
export function generateStaticParams() { return DIALECTS.map((d) => ({ dialect: d.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ dialect: string }> }): Promise<Metadata> {
  const d = dialectBySlug((await params).dialect);
  return d ? { title: `تحويل النص إلى صوت بـ${d.name}`, description: `أصوات طبيعية بـ${d.name} لمحتواك. جرّب دقيقة مجاناً.` } : {};
}

export default async function DialectPage({ params }: { params: Promise<{ dialect: string }> }) {
  const d = dialectBySlug((await params).dialect);
  if (!d) notFound();
  return <Landing dialect={d} />;
}
