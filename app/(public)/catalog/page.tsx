'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGetQuizzesQuery } from '@/store/api/quizApi';
import { Input } from '@/components/ui/core/Input';
import { Search, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/core/Card';
import { pluralize } from '@/lib/utils';
import { Filters } from '@/components/ui/core/Filters';

export default function CatalogPage() {
  const router = useRouter();
  const { data: quizzes, isLoading: quizzesLoading } = useGetQuizzesQuery({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('popular');

  // Фильтры
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  // Выпадающий поиск
  useEffect(() => {
    if (!quizzes || searchQuery.length < 1) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }
    const filtered = quizzes
      .filter((q: any) =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
    setSuggestions(filtered);
    setIsDropdownOpen(true);
  }, [searchQuery, quizzes]);

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
        <Input
          placeholder="Поиск квизов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search size={20} />}
          rightIcon={
            searchQuery.length > 0 && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsDropdownOpen(false);
                  setSuggestions([]);
                }}
                className="text-(--loom-white)/40 hover:text-(--loom-white) transition-colors"
                aria-label="Очистить поиск"
              >
                ✕
              </button>
            )
          }
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
          onFocus={() => searchQuery.length > 0 && setIsDropdownOpen(true)}
        />

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
          {sortedQuizzes.map((quiz: any) => (
            <Card
              key={quiz.id}
              className="cursor-pointer hover:scale-[1.01] transition-transform duration-200"
              onClick={() => router.push(`/quiz/${quiz.id}`)}
            >
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-lg">{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex flex-col gap-1">
                <div className="flex justify-between items-center text-sm text-(--loom-white)/60">
                  <span>
                    {quiz._count?.questions || 0} {pluralize(quiz._count?.questions || 0, 'вопрос', 'вопроса', 'вопросов')}
                  </span>
                  <span className="text-(--loom-cyan) text-xs font-medium">
                    {quiz.category?.name || 'Без категории'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-(--loom-white)/40">
                    {quiz.level ? quiz.level.charAt(0) + quiz.level.slice(1).toLowerCase() : 'Любой'}
                  </span>
                  {quiz.level && (
                    <span className="w-1 h-1 rounded-full bg-(--glitch-pink)" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}