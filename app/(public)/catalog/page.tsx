// app/(public)/catalog/page.tsx

'use client';

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGetQuizzesQuery } from '@/store/api/quizApi';
import { Input } from '@/components/ui/core/Input';
import { Search, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/core/Card';
import { Button } from '@/components/ui/core/Button';

export default function CatalogPage() {
  const router = useRouter();
  const { data: quizzes, isLoading } = useGetQuizzesQuery({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Фильтрация по поиску
  const filteredQuizzes = useMemo(() => {
    if (!quizzes) return [];
    return quizzes.filter((quiz: any) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [quizzes, searchQuery]);

  // Сортировка (заглушка, пока просто возвращаем как есть)
  const sortedQuizzes = useMemo(() => {
    // Здесь позже добавим реальную сортировку
    return filteredQuizzes;
  }, [filteredQuizzes, sortBy]);

  if (isLoading) {
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
      {/* Заголовок */}
      <h1 className="text-2xl font-bold mb-6">Каталог квизов</h1>

      {/* Поиск */}
      <div className="mb-6">
        <Input
          placeholder="Поиск квизов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search size={20} />}
        />
      </div>

      {/* Сортировка (заглушка) */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm text-(--loom-white)/60 flex items-center gap-1">
            <Filter size={16} /> Сортировка:
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {['popular', 'newest', 'alphabetical', 'number'].map((option) => (
            <Button
              key={option}
              variant={sortBy === option ? 'glitch' : 'secondary'}
              size="sm"
              onClick={() => setSortBy(option)}
              className="px-4 py-1.5 text-xs shrink-0"
            >
              {option === 'popular' && 'Популярные'}
              {option === 'newest' && 'Новые'}
              {option === 'alphabetical' && 'По алфавиту'}
              {option === 'number' && 'По количеству вопросов'}

              
            </Button>
          ))}
        </div>
      </div>

      {/* Сетка карточек */}
      {sortedQuizzes.length === 0 ? (
        <div className="text-center py-16 text-(--loom-white)/60">
          <p>Ничего не найдено 😕</p>
          <p className="text-sm mt-1">Попробуй изменить поисковый запрос</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sortedQuizzes.map((quiz: any) => (
            <Card
              key={quiz.id}
              className="cursor-pointer hover:scale-[1.01] transition-transform duration-200"
              onClick={() => router.push(`/quiz/${quiz.id}`)}
            >
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-lg">{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex justify-between items-center text-sm text-(--loom-white)/60">
                <span>{quiz._count?.questions || 0} вопросов</span>
                <span className="text-(--loom-cyan) text-xs">
                  {/* Позже здесь будет категория */}
                  Без категории
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}