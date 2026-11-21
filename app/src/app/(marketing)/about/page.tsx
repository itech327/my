import type { Metadata } from 'next';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = { title: 'عن المشروع' };

export default function About() {
  return (
    <article className="mx-auto max-w-prose px-16 pt-40">
      <h1 className="mb-16 text-2xl">عن {BRAND.name}</h1>
      <p className="mb-16 text-lg font-normal">نبني أداة بسيطة تحوّل النص العربي إلى صوت يشبه طريقة كلامنا فعلاً، بلهجاتنا كلها وليس بالفصحى وحدها.</p>
      <p className="text-text-muted">هذه الصفحة تنتظر قصة المؤسسين وصورهم. تُكتب في مرحلة الهوية.</p>
    </article>
  );
}
