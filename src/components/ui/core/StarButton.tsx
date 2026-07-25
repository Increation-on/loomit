'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarButtonProps {
  active: boolean;
  onClick: () => void;
  loading?: boolean;
  className?: string;
  size?: number;
}

export function StarButton({
  active,
  onClick,
  loading = false,
  className,
  size = 20,
}: StarButtonProps) {
  return (
    <button
     type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('[StarButton] click');
        onClick();
      }}
      disabled={loading}
      className={cn(
        'transition-all duration-200 hover:scale-110 active:scale-95',
        active
          ? 'text-(--loom-yellow)'
          : 'text-(--loom-white)/40 hover:text-(--loom-white)',
        className
      )}
    >
      <Star
        size={size}
        fill={active ? 'currentColor' : 'none'}
        strokeWidth={1.5}
      />
    </button>
  );
}