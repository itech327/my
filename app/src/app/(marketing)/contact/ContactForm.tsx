'use client';
import { useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';

// No backend yet: the message is validated and acknowledged only. /replica-backend wires email.
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  if (sent) return <p role="status" className="rounded-md bg-success-soft p-16 text-on-success-soft">وصلتنا رسالتك. شكراً لك.</p>;
  return (
    <form className="grid gap-16" onSubmit={(e) => {
      e.preventDefault();
      const f = new FormData(e.currentTarget);
      if (String(f.get('message') ?? '').trim().length < 10) { setErr('اكتب رسالة من عشرة أحرف على الأقل'); return; }
      setSent(true);
    }}>
      <Field label="الاسم" name="name" autoComplete="name" />
      <Field label="البريد الإلكتروني" name="email" type="email" dir="ltr" required autoComplete="email" />
      <div className="grid gap-4">
        <label htmlFor="message" className="text-sm font-semibold">الرسالة</label>
        <textarea id="message" name="message" rows={5} aria-invalid={err ? true : undefined} aria-describedby={err ? 'msg-err' : undefined}
          className={`rounded-md border bg-surface p-12 ${err ? 'border-danger' : 'border-border-input'}`} />
        {err && <p id="msg-err" className="text-sm text-danger">{err}</p>}
      </div>
      <Button type="submit" className="justify-self-start">إرسال</Button>
    </form>
  );
}
