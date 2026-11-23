import type { ReactNode } from 'react';

export function EmptyState({ icon, title, help, action }: { icon: ReactNode; title: string; help: string; action?: ReactNode }) {
  return (
    <div className="grid justify-items-center gap-8 rounded-lg border border-dashed border-border-input px-24 py-40 text-center">
      <span className="text-text-muted" aria-hidden>{icon}</span>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-text-muted">{help}</p>
      {action}
    </div>
  );
}
