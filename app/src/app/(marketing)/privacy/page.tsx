import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'سياسة الخصوصية' };

// Placeholder. Real legal text must be written for this product and reviewed by a lawyer.
export default function Page() {
  return (
    <article className="mx-auto max-w-prose px-16 pt-40">
      <h1 className="mb-16 text-2xl">سياسة الخصوصية</h1>
      <p role="note" className="rounded-md border border-border-input bg-surface p-16 text-text-muted">مسودة: النص القانوني لم يُكتب بعد. لا تُطلق الخدمة قبل كتابته ومراجعته.</p>
    </article>
  );
}
