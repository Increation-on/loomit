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
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        'bg-(--loom-black) glitch-border rounded-xl',
        className
      )}
    >
      {icon ? (
        <div className="text-4xl mb-4 text-(--loom-cyan)">
          {icon}
        </div>
      ) : (
        <div className="text-4xl mb-4 text-(--loom-cyan)">⊘</div>
      )}
      <h2 className="text-xl font-bold text-(--loom-white) mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-(--loom-white)/60 max-w-sm">
          {description}
        </p>
      )}
    </div>
  );
}