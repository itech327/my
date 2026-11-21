import type { Metadata } from 'next';
import { Mic } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = { title: 'استنساخ صوتك' };

// Planned for a later milestone (architecture.md build order). Needs the speech engine first.
export default function Page() {
  return (
    <div className="mx-auto grid max-w-prose gap-24">
      <div className="flex items-center gap-8"><h1 className="text-2xl">استنساخ صوتك</h1><Badge>قريباً</Badge></div>
      <div className="grid gap-16 rounded-lg border border-border bg-surface p-24">
        <Mic className="size-avatar text-accent" aria-hidden />
        <p>ارفع تسجيلاً نظيفاً لصوتك من دقيقة إلى ثلاث، وأكّد أنه صوتك أو أن صاحبه وافق كتابةً. نصنع منه صوتاً خاصاً لا يراه غيرك.</p>
        <ol className="grid list-decimal gap-4 ps-24 text-sm text-text-muted">
          <li>تسجيل بلا ضجيج، بصوتك الطبيعي</li><li>تأكيد الموافقة، ويُحفظ تاريخها</li><li>اختيار: خاص لك، أو عام للجميع</li>
        </ol>
      </div>
    </div>
  );
}
