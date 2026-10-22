'use client';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';

import { EmptyState } from '@/components/ui/feedback/EmptyState';
import { Skeleton } from '@/components/ui/feedback/Skeleton';
import { CatalogCard } from '@/components/cards/CatalogCard';
import { pluralize } from '@/lib/utils';

import { useGetFavoritesQuery, useToggleFavoriteMutation } from '@/store/api/favoritesApi';
import { useGetStatusesQuery } from '@/store/api/attemptsApi';
import { usePageHeader } from '@/hooks/usePageHeader';
import { PageContentTitle } from '@/components/ui/core/PageContentTitle';

export default function FavoritesPage() {
  const { data: session, status } = useSession();

  const { data: favorites = [], isLoading } = useGetFavoritesQuery(undefined, {
    skip: !session,
  });

  const [toggleFavorite] = useToggleFavoriteMutation();

  const quizIds = useMemo(() => favorites.map((fav) => fav.quiz.id), [favorites]);

  const { data: attemptStatuses = {} } = useGetStatusesQuery(quizIds, {});

  usePageHeader({ variant: 'tab', title: 'Избранное' });

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-(--loom-black) px-4 pt-6 pb-24 text-(--loom-white)">
        <PageContentTitle title="Избранное" showBack={false} className="mb-6" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--loom-black) p-4 text-(--loom-white)">
        <div className="glitch-border w-full max-w-md space-y-4 rounded-2xl bg-(--loom-white)/5 p-8 text-center">
          <div className="mb-4 text-6xl">⭐</div>

          <h2 className="text-2xl font-bold">Избранное доступно только авторизованным</h2>

          <p className="text-sm text-(--loom-white)/60">
            Войдите или зарегистрируйтесь, чтобы сохранять квизы и возвращаться к ним позже.
          </p>

          <div className="flex flex-col gap-3 pt-4">
            <a
              href="/login"
              className="w-full rounded-xl bg-(--loom-yellow) px-4 py-3 text-center font-semibold text-(--loom-black) transition hover:opacity-90"
            >
              Войти
            </a>

            <a
              href="/register"
              className="w-full rounded-xl border border-(--loom-white)/20 bg-(--loom-white)/10 px-4 py-3 text-center text-(--loom-white) transition hover:bg-(--loom-white)/20"
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
      <div className="min-h-screen bg-(--loom-black) px-4 pt-6 pb-24 text-(--loom-white)">
        <PageContentTitle title="Избранное" showBack={false} className="mb-6" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-(--loom-black) px-4 pt-6 pb-24 text-(--loom-white)">
        <PageContentTitle title="Избранное" showBack={false} className="mb-6" />

        <EmptyState
          title="Нет избранных квизов"
          description="Добавляйте квизы в избранное, чтобы быстро возвращаться к ним позже."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--loom-black) px-4 pt-6 pb-24 text-(--loom-white)">
      
      {/* Заголовок со счетчиком */}
      <div className="mb-6 flex flex-col gap-1">
        <PageContentTitle title="Избранное" showBack={false} className="mb-0" />
        <span className="text-sm text-(--loom-white)/60">
          {favorites.length} {pluralize(favorites.length, 'квиз', 'квиза', 'квизов')}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
