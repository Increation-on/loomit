// src/components/ui/core/BackLink.tsx

'use client';

import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuizReturn } from '@/hooks/useQuizReturn';

interface BackLinkProps {
  fallback?: string;
  className?: string;
  label?: string;
  iconSize?: number;
  children?: React.ReactNode;
}

export function BackLink({
  fallback = '/catalog',
  className,
  label = 'Назад',
  iconSize = 22,
  children,
}: BackLinkProps) {
  const { goBack } = useQuizReturn(fallback);

  return (
    <button
      onClick={goBack}
      className={cn(
        'inline-flex items-center gap-2 text-(--loom-white)/60 hover:text-(--loom-white) transition-colors active:scale-[0.98]',
        className
      )}
    >
      <ChevronLeft size={iconSize} />
      {children || label}
    </button>
  );
}