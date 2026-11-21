import type { Metadata } from 'next';
import { FileAudio } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export const metadata: Metadata = { title: 'المدونة' };

export default function Blog() {
  return (
    <div className="mx-auto max-w-content px-16 pt-40">
      <h1 className="mb-24 text-2xl">المدونة</h1>
      <EmptyState icon={<FileAudio className="size-avatar" />} title="لا مقالات بعد" help="نكتب قريباً عن التعليق الصوتي واللهجات وصناعة المحتوى." />
    </div>
  );
}
