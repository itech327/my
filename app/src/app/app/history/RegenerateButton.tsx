'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function RegenerateButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <div className="grid gap-4">
      <Button variant="secondary" size="sm" loading={busy} icon={<RotateCcw className="size-icon" aria-hidden />} onClick={async () => {
        setBusy(true); setErr(null);
        const r = await fetch(`/api/generations/${id}/regenerate`, { method: 'POST' });
        if (!r.ok) setErr((await r.json()).error ?? 'تعذّرت الإعادة'); else router.refresh();
        setBusy(false);
      }}>أعد الإنشاء</Button>
      {err && <p role="alert" className="text-xs text-danger">{err}</p>}
    </div>
  );
}
