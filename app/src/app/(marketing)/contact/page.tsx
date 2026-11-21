import type { Metadata } from 'next';
import { ContactForm } from './ContactForm';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = { title: 'اتصل بنا' };

export default function Contact() {
  return (
    <div className="mx-auto max-w-prose px-16 pt-40">
      <h1 className="mb-8 text-2xl">اتصل بنا</h1>
      <p className="mb-24 text-text-muted">نرد خلال يوم عمل. أو راسلنا مباشرة على <a className="underline" dir="ltr" href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>.</p>
      <ContactForm />
    </div>
  );
}
