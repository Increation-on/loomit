'use client';

import { useState, useMemo } from 'react';
import { useGetQuizzesQuery } from '@/store/api/quizApi';
import { Filters } from '@/components/ui/core/Filters';
import { useSearchParams } from 'next/navigation';
import { SearchWithDropdown } from '@/components/ui/core/SearchWithDropDown';
import { Skeleton, CatalogCardSkeleton } from '@/components/ui/feedback/Skeleton';
import { CatalogCard } from '@/components/features/CatalogCard';
import { useGetStatusesQuery } from '@/store/api/attemptsApi';
import { useFavorites } from '@/hooks/useFavorites';

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const { data: quizzes, isLoading: quizzesLoading } = useGetQuizzesQuery({});

  const [sortBy, setSortBy] = useState('popular');

  const [categoryFilter, setCategoryFilter] = useState(categoryFromUrl || 'all');
  const [levelFilter, setLevelFilter] = useState('all');

  const quizIds = useMemo(
    () => quizzes?.map((q: any) => q.id) ?? [],
    [quizzes]
  );

  const { data: attemptStatuses = {} } = useGetStatusesQuery(quizIds, {
    skip: quizIds.length === 0,
  });

  const {
    isFavorite,
    toggle,
    isAuthenticated,
    isLoading,
  } = useFavorites();


  const displayedQuizzes = useMemo(() => {
    if (!quizzes) return [];

    const result = quizzes.filter((quiz: any) => {
      const matchCategory =
        categoryFilter === 'all' || quiz.category?.id === categoryFilter;

      const matchLevel =
        levelFilter === 'all' || quiz.level === levelFilter;

      return matchCategory && matchLevel;
    });

    switch (sortBy) {
      case 'newest':
        return result.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

      case 'alphabetical':
        return result.sort((a: any, b: any) =>
          a.title.localeCompare(b.title)
        );

      case 'popular':
        return result.sort(
          (a: any, b: any) =>
            (b._count?.attempts || 0) - (a._count?.attempts || 0)
        );

      default:
        return result;
    }
  }, [quizzes, categoryFilter, levelFilter, sortBy]);

  if (quizzesLoading) {
    return (
      <div className="min-h-screen bg-(--loom-black) text-(--loom-white) pb-24 px-4 pt-6">
        <h1 className="text-2xl font-bold mb-6">Каталог квизов</h1>
        <div className="mb-6">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="space-y-3 mb-6">
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
      <h1 className="text-2xl font-bold mb-6">Каталог квизов</h1>

      <div className="relative mb-6">
        <SearchWithDropdown items={quizzes || []} placeholder="Поиск квизов..." />
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
          <p>Ничего не найдено 😕</p>
          <p className="text-sm mt-1">Попробуй изменить фильтры или поиск</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {displayedQuizzes.map((quiz: any) => (
            <CatalogCard
              key={quiz.id}
              quiz={quiz}
              lastAttempt={attemptStatuses[quiz.id]}
              showFavorite={isAuthenticated}
              isFavorited={isFavorite(quiz.id)}
              isFavoriteLoading={isLoading}
              onFavoriteToggle={() => toggle(quiz.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}