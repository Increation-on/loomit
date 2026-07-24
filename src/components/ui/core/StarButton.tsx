'use client';

import { Star } from 'lucide-react';
import { useToggleFavoriteMutation, useCheckFavoriteQuery } from '@/store/api/favoritesApi';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StarButtonProps {
  quizId: string;
  className?: string;
  size?: number;
}

export function StarButton({ quizId, className, size = 20 }: StarButtonProps) {
  const { data: session } = useSession();
  const { data: isFavorited, isLoading: isChecking, refetch, status } = useCheckFavoriteQuery(quizId, {
    skip: !session,
  });
  const [toggleFavorite, { isLoading: isToggling }] = useToggleFavoriteMutation();
  const [optimisticState, setOptimisticState] = useState<boolean | null>(null);

  const isFavoritedValue = isFavorited?.favorited ?? false;

  const isActive = optimisticState !== null
    ? optimisticState
    : isChecking
      ? false
      : isFavoritedValue;

  const handleToggle = async (e: React.MouseEvent) => {
  e.stopPropagation();
  if (!session) return;

  const newState = !isActive;
  setOptimisticState(newState);

  try {
    await toggleFavorite(quizId).unwrap();
    // ✅ Не вызываем refetch, инвалидация сделает всё сама
  } catch (error) {
    setOptimisticState(null);
    console.error('Failed to toggle favorite', error);
  }
};

  if (!session) {
    return null;
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling}
      className={cn(
        'transition-all duration-200 hover:scale-110 active:scale-95',
        isActive && 'text-(--loom-yellow)',
        !isActive && 'text-(--loom-white)/40 hover:text-(--loom-white)',
        className
      )}
    >
      <Star
        size={size}
        fill={isActive ? 'currentColor' : 'none'}
        strokeWidth={isActive ? 1.5 : 1.5}
      />
    </button>
  );
}