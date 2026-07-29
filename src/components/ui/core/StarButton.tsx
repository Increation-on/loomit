'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarButtonProps {
  active: boolean;
  onClick: () => void;
  className?: string;
  size?: number;
  disabled?: boolean;
}

export function StarButton({
  active,
  onClick,
  className,
  size = 20,
  disabled = false,
}: StarButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        'transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50',
        active
          ? 'text-(--loom-yellow)'
          : 'text-(--loom-white)/40 hover:text-(--loom-white)',
        className
      )}
      aria-label={
        active
          ? 'Удалить из избранного'
          : 'Добавить в избранное'
      }
    >
      <Star
        size={size}
        fill={active ? 'currentColor' : 'none'}
        strokeWidth={1.5}
      />
    </button>
  );
}