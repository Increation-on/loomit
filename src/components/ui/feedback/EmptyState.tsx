// src/components/ui/feedback/EmptyState.tsx
'use client';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-4 py-16 text-center',
        'glitch-border rounded-xl bg-(--loom-black)',
        className
      )}
    >
      {icon ? (
        <div className="mb-4 text-4xl text-(--loom-cyan)">{icon}</div>
      ) : (
        <div className="mb-4 text-4xl text-(--loom-cyan)">⊘</div>
      )}
      <h2 className="mb-2 text-xl font-bold text-(--loom-white)">{title}</h2>
      {description && <p className="max-w-sm text-(--loom-white)/60">{description}</p>}
    </div>
  );
}
