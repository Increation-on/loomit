'use client';

import { useState, useEffect, useMemo } from 'react';
import { useGetQuizzesQuery } from '@/store/api/quizApi';
import { Filters } from '@/components/ui/core/Filters';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchWithDropdown } from '@/components/ui/core/SearchWithDropDown';
import { Skeleton, CatalogCardSkeleton } from '@/components/ui/feedback/Skeleton';
import { CatalogCard } from '@/components/features/CatalogCard'; // ← новый импорт

export default function CatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const { data: quizzes, isLoading: quizzesLoading } = useGetQuizzesQuery({});

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('popular');

  const [attemptStatuses, setAttemptStatuses] = useState<Record<string, any>>({});

  const [categoryFilter, setCategoryFilter] = useState(categoryFromUrl || 'all');
  const [levelFilter, setLevelFilter] = useState('all');

  useEffect(() => {
    if (!quizzes?.length) return;

    const fetchStatuses = async () => {
      const quizIds = quizzes.map((q: any) => q.id);
      const res = await fetch('/api/quizzes/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizIds }),
      });
      const data = await res.json();
      setAttemptStatuses(data);
    };

    fetchStatuses();
  }, [quizzes]);

  const filteredQuizzes = useMemo(() => {
    if (!quizzes) return [];
    return quizzes.filter((quiz: any) => {
      const matchCategory = categoryFilter === 'all' || quiz.category?.id === categoryFilter;
      const matchLevel = levelFilter === 'all' || quiz.level === levelFilter;
      return matchCategory && matchLevel;
    });
  }, [quizzes, categoryFilter, levelFilter]);

  const sortedQuizzes = useMemo(() => {
    const sorted = [...filteredQuizzes];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'alphabetical':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'popular':
        return sorted.sort((a, b) => (b._count?.attempts || 0) - (a._count?.attempts || 0));
      default:
        return sorted;
    }
  }, [filteredQuizzes, sortBy]);

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

        {isDropdownOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 z-30 glitch-border rounded-xl bg-(--loom-black) p-2 max-h-60 overflow-y-auto shadow-xl">
            {suggestions.map((quiz: any) => (
              <button
                key={quiz.id}
                onClick={() => {
                  router.push(`/quiz/${quiz.id}`);
                  setIsDropdownOpen(false);
                  setSearchQuery('');
                }}
                className="w-full text-left px-3 py-2 text-sm text-(--loom-white) hover:bg-(--loom-white)/10 rounded-lg transition-colors flex justify-between items-center"
              >
                <span className="truncate">{quiz.title}</span>
                <span className="text-(--loom-cyan) text-xs">Перейти →</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <Filters
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {sortedQuizzes.length === 0 ? (
        <div className="text-center py-16 text-(--loom-white)/60">
          <p>Ничего не найдено 😕</p>
          <p className="text-sm mt-1">Попробуй изменить фильтры или поиск</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {sortedQuizzes.map((quiz: any) => (
            <CatalogCard
              key={quiz.id}
              quiz={quiz}
              lastAttempt={attemptStatuses[quiz.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}