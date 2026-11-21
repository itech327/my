import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-screen place-items-center px-16 text-center">
      <div className="grid justify-items-center gap-16">
        <p className="text-display text-text-muted" dir="ltr">404</p>
        <h1 className="text-xl">هذه الصفحة غير موجودة</h1>
        <ButtonLink href="/">العودة إلى الرئيسية</ButtonLink>
      </div>
    </main>
  );
}
