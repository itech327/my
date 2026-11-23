import { ChevronDown } from 'lucide-react';

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((it) => (
        <details key={it.q} className="group py-16">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-16 text-lg font-semibold [&::-webkit-details-marker]:hidden">
            {it.q}
            <ChevronDown className="size-icon-lg shrink-0 text-text-muted transition group-open:rotate-180" aria-hidden />
          </summary>
          <p className="mt-8 text-text-muted">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
