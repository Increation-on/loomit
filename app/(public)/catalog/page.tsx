'use client';

import { useState, useEffect, useMemo } from 'react';
import { useGetQuizzesQuery } from '@/store/api/quizApi';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { Input } from '@/components/ui/core/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/core/Card';
import { cn, pluralize } from '@/lib/utils';
import { Filters } from '@/components/ui/core/Filters';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchWithDropdown } from '@/components/ui/core/SearchWithDropDown';

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

  // Фильтры
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

  // Фильтрация
  const filteredQuizzes = useMemo(() => {
    if (!quizzes) return [];
    return quizzes.filter((quiz: any) => {
      const matchCategory = categoryFilter === 'all' || quiz.category?.id === categoryFilter;
      const matchLevel = levelFilter === 'all' || quiz.level === levelFilter;
      return matchCategory && matchLevel;
    });
  }, [quizzes, categoryFilter, levelFilter]);

  // Сортировка
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-(--loom-white)/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--loom-black) text-(--loom-white) pb-24 px-4 pt-6">
      <h1 className="text-2xl font-bold mb-6">Каталог квизов</h1>

      {/* ПОИСК */}
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

      {/* СЕТКА КАРТОЧЕК */}
      {sortedQuizzes.length === 0 ? (
        <div className="text-center py-16 text-(--loom-white)/60">
          <p>Ничего не найдено 😕</p>
          <p className="text-sm mt-1">Попробуй изменить фильтры или поиск</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {sortedQuizzes.map((quiz: any) => {
            const lastAttempt = attemptStatuses[quiz.id];
            return (
              <Card
                key={quiz.id}
                className="cursor-pointer hover:scale-[1.01] transition-transform duration-200"
                onClick={() => router.push(`/quiz/${quiz.id}`)}
              >
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex flex-col gap-1 relative">
                  <div className="flex justify-between items-center text-sm text-(--loom-white)/60">
                    <span>
                      {quiz._count?.questions || 0} {pluralize(quiz._count?.questions || 0, 'вопрос', 'вопроса', 'вопросов')}
                    </span>
                    <div className="flex flex-col items-end relative">
                      <div className="absolute -top-9 right-0">
                        {quiz.category?.iconUrl ? (
                          <img
                            src={quiz.category.iconUrl}
                            alt={quiz.category.name}
                            className="w-7 h-7 rounded-full object-contain"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-(--loom-cyan)/20 flex items-center justify-center text-s text-(--loom-cyan) font-bold">
                            {quiz.category?.name?.[0] || '?'}
                          </div>
                        )}
                      </div>
                      <span className="text-(--loom-magenta) text-l font-medium">
                        {quiz.category?.name || 'Без категории'}
                      </span>
                    </div>
                  </div>

                  {/* Статус + уровень */}
                  <div className="flex items-center gap-2 text-xs">
                    {lastAttempt && (
                      <>
                        <span
                          className={cn(
                            'font-semibold',
                            lastAttempt.score === lastAttempt.totalQuestions && 'text-(--loom-cyan)',
                            lastAttempt.score < lastAttempt.totalQuestions && 'text-(--loom-yellow)'
                          )}
                        >
                          {lastAttempt.score}/{lastAttempt.totalQuestions}
                        </span>
                        <span className="text-(--loom-white)/30">•</span>
                      </>
                    )}
                    <span className="text-(--loom-white)/40">
                      {quiz.level ? quiz.level.charAt(0) + quiz.level.slice(1).toLowerCase() : 'Любой'}
                    </span>
                    {quiz.level && (
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          quiz.level === 'JUNIOR' && 'bg-(--loom-cyan)',
                          quiz.level === 'MIDDLE' && 'bg-(--loom-yellow)',
                          quiz.level === 'SENIOR' && 'bg-(--glitch-pink)'
                        )}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}