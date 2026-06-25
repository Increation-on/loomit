// app/(public)/catalog/page.tsx

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/core/Input';
import { Search, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/core/Card';
import { Button } from '@/components/ui/core/Button';

// Мок-данные для примера (потом заменишь на реальный API)
const mockQuizzes = [
  { id: 1, title: 'React для начинающих', questions: 10, category: 'Frontend' },
  { id: 2, title: 'TypeScript: продвинутый уровень', questions: 15, category: 'Frontend' },
  { id: 3, title: 'Основы JavaScript', questions: 8, category: 'Frontend' },
  { id: 4, title: 'Алгоритмы и структуры данных', questions: 12, category: 'Backend' },
  { id: 5, title: 'Базы данных: SQL', questions: 20, category: 'Backend' },
];

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Фильтрация по поиску
  const filteredQuizzes = mockQuizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Сортировка */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <span className="text-sm text-(--loom-white)/60 flex items-center gap-1">
          <Filter size={16} /> Сортировка:
        </span>
        {['popular', 'newest', 'questions'].map((option) => (
          <Button
            key={option}
            variant={sortBy === option ? 'glitch' : 'secondary'}
            size="sm"
            onClick={() => setSortBy(option)}
            className="px-4 py-1.5 text-xs"
          >
            {option === 'popular' && 'Популярные'}
            {option === 'newest' && 'Новые'}
            {option === 'questions' && 'По кол-ву вопросов'}
          </Button>
        ))}
      </div>

      {/* Сетка карточек */}
      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-16 text-(--loom-white)/60">
          <p>Ничего не найдено 😕</p>
          <p className="text-sm mt-1">Попробуй изменить поисковый запрос</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="cursor-pointer hover:scale-[1.01] transition-transform duration-200">
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-lg">{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex justify-between items-center text-sm text-(--loom-white)/60">
                <span>{quiz.questions} вопросов</span>
                <span className="text-(--loom-cyan) text-xs">{quiz.category}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}