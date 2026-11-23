import type { Metadata } from 'next';
import { AudioLines } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = { title: 'مؤثرات صوتية' };

// Planned for a later milestone (architecture.md build order). Needs the speech engine first.
export default function Page() {
  return (
    <div className="mx-auto grid max-w-prose gap-24">
      <div className="flex items-center gap-8"><h1 className="text-2xl">مؤثرات صوتية</h1><Badge>قريباً</Badge></div>
      <div className="grid gap-16 rounded-lg border border-border bg-surface p-24">
        <AudioLines className="size-avatar text-accent" aria-hidden />
        <p>صف المشهد بكلماتك، مثل «مطر خفيف على نافذة»، واختر المدة، ونصنع لك المؤثر.</p>
        <ol className="grid list-decimal gap-4 ps-24 text-sm text-text-muted">
          <li>وصف قصير وواضح للصوت</li><li>مدة من ثانيتين إلى عشرين</li><li>تنزيل الملف واستعماله في مشروعك</li>
        </ol>
      </div>
    </div>
  );
}
