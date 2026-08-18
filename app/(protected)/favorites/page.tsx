'use client';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';

import { EmptyState } from '@/components/ui/feedback/EmptyState';
import { Skeleton } from '@/components/ui/feedback/Skeleton';
import { CatalogCard } from '@/components/features/CatalogCard';
import { pluralize } from '@/lib/utils';

import {
  useGetFavoritesQuery,
  useToggleFavoriteMutation,
} from '@/store/api/favoritesApi';
import { useGetStatusesQuery } from '@/store/api/attemptsApi';

export default function FavoritesPage() {
  const { data: session, status } = useSession();

  const { data: favorites = [], isLoading } = useGetFavoritesQuery(undefined, {
    skip: !session,
  });

  const [toggleFavorite] = useToggleFavoriteMutation();

  const quizIds = useMemo(
    () => favorites.map((fav) => fav.quiz.id),
    [favorites]
  );

  const { data: attemptStatuses = {} } = useGetStatusesQuery(quizIds, {});

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-(--loom-black) text-(--loom-white) pb-24 px-4 pt-6">
        <h1 className="text-2xl font-bold mb-6">Избранное</h1>
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-(--loom-black) text-(--loom-white) flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-(--loom-white)/5 rounded-2xl p-8 glitch-border text-center space-y-4">
          <div className="text-6xl mb-4">⭐</div>

          <h2 className="text-2xl font-bold">Избранное доступно только авторизованным</h2>

          <p className="text-(--loom-white)/60 text-sm">
            Войдите или зарегистрируйтесь, чтобы сохранять квизы и возвращаться к ним позже.
          </p>

          <div className="flex flex-col gap-3 pt-4">
            <a
              href="/login"
              className="w-full py-3 px-4 bg-(--loom-yellow) text-(--loom-black) font-semibold rounded-xl hover:opacity-90 transition text-center"
            >
              Войти
            </a>

            <a
              href="/register"
              className="w-full py-3 px-4 bg-(--loom-white)/10 text-(--loom-white) rounded-xl hover:bg-(--loom-white)/20 transition text-center border border-(--loom-white)/20"
            >
              Зарегистрироваться
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-(--loom-black) text-(--loom-white) pb-24 px-4 pt-6">
        <h1 className="text-2xl font-bold mb-6">Избранное</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-(--loom-black) text-(--loom-white) pb-24 px-4 pt-6">
        <h1 className="text-2xl font-bold mb-6">Избранное</h1>

        <EmptyState
          title="Нет избранных квизов"
          description="Добавляйте квизы в избранное, чтобы быстро возвращаться к ним позже."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--loom-black) text-(--loom-white) pb-24 px-4 pt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Избранное</h1>

        <span className="text-sm text-(--loom-white)/60">
          {favorites.length} {pluralize(favorites.length, 'квиз', 'квиза', 'квизов')}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {favorites.map((fav) => (
          <CatalogCard
            key={fav.quiz.id}
            quiz={fav.quiz}
            lastAttempt={attemptStatuses[fav.quiz.id]}
            showFavorite
            isFavorited={true}
            origin="/favorites" 
            onFavoriteToggle={() =>
              toggleFavorite({
                quizId: fav.quiz.id,
                quiz: fav.quiz,
              }).unwrap()
            }
          />
        ))}
      </div>
    </div>
  );
}