'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { useGetQuizzesQuery } from '@/store/api/quizApi';
import { useGetStatusesQuery } from '@/store/api/attemptsApi';
import {
  useGetFavoritesQuery,
  useToggleFavoriteMutation,
} from '@/store/api/favoritesApi';

import { Filters } from '@/components/ui/core/Filters';
import { SearchWithDropdown } from '@/components/ui/core/SearchWithDropDown';
import {
  Skeleton,
  CatalogCardSkeleton,
} from '@/components/ui/feedback/Skeleton';
import { CatalogCard } from '@/components/features/CatalogCard';


export default function CatalogPage() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const { data: session } = useSession();

  const {
    data: quizzes,
    isLoading: quizzesLoading,
  } = useGetQuizzesQuery({});


  const { data: favorites = [] } = useGetFavoritesQuery(undefined, {
    skip: !session,
  });


  const [toggleFavorite] = useToggleFavoriteMutation();


  const [sortBy, setSortBy] = useState('popular');

  const [categoryFilter, setCategoryFilter] = useState(
    categoryFromUrl || 'all'
  );

  const [levelFilter, setLevelFilter] = useState('all');


  const favoriteIds = useMemo(
    () => new Set(favorites.map((fav) => fav.quiz.id)),
    [favorites]
  );


  const quizIds = useMemo(
    () => quizzes?.map((quiz: any) => quiz.id) ?? [],
    [quizzes]
  );


  const {
    data: attemptStatuses = {},
  } = useGetStatusesQuery(quizIds, {
    skip: quizIds.length === 0,
  });


  const displayedQuizzes = useMemo(() => {
    if (!quizzes) return [];

    const filtered = quizzes.filter((quiz: any) => {
      const matchCategory =
        categoryFilter === 'all' ||
        quiz.category?.id === categoryFilter;

      const matchLevel =
        levelFilter === 'all' ||
        quiz.level === levelFilter;

      return matchCategory && matchLevel;
    });


    switch (sortBy) {
      case 'newest':
        return [...filtered].sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );


      case 'alphabetical':
        return [...filtered].sort(
          (a: any, b: any) =>
            a.title.localeCompare(b.title)
        );


      case 'popular':
        return [...filtered].sort(
          (a: any, b: any) =>
            (b._count?.attempts ?? 0) -
            (a._count?.attempts ?? 0)
        );


      default:
        return filtered;
    }
  }, [
    quizzes,
    categoryFilter,
    levelFilter,
    sortBy,
  ]);


  if (quizzesLoading) {
    return (
      <div className="min-h-screen bg-(--loom-black) text-(--loom-white) pb-24 px-4 pt-6">
        <h1 className="text-2xl font-bold mb-6">
          Каталог квизов
        </h1>

        <Skeleton className="h-12 w-full rounded-xl" />

        <div className="space-y-3 my-6">
          <Skeleton className="h-10 w-48 rounded-full" />
          <Skeleton className="h-10 w-36 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <CatalogCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-(--loom-black) text-(--loom-white) pb-24 px-4 pt-6">
      <h1 className="text-2xl font-bold mb-6">
        Каталог квизов
      </h1>


      <div className="relative mb-6">
        <SearchWithDropdown
          items={quizzes || []}
          placeholder="Поиск квизов..."
        />
      </div>


      <Filters
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />


      {displayedQuizzes.length === 0 ? (
        <div className="text-center py-16 text-(--loom-white)/60">
          <p>
            Ничего не найдено 😕
          </p>

          <p className="text-sm mt-1">
            Попробуй изменить фильтры или поиск
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {displayedQuizzes.map((quiz: any) => (
            <CatalogCard
              key={quiz.id}
              quiz={quiz}
              lastAttempt={attemptStatuses[quiz.id]}
              showFavorite={!!session}
              isFavorited={favoriteIds.has(quiz.id)}
              onFavoriteToggle={() =>
                toggleFavorite({
                  quizId: quiz.id,
                  quiz,
                }).unwrap()
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}