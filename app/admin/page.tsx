'use client';

import { useState, useEffect, useMemo } from 'react';
import { useGetQuizzesQuery } from '@/store/api/quizApi';
import Link from 'next/link';
import { Button } from '@/components/ui/core/Button';
import { Modal } from '@/components/ui/feedback/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/core/Card';
import { useToast } from '@/components/ui/feedback/ToastContainer';
import { Plus, Pencil, Eye, Trash2, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { pluralize } from '@/lib/utils';
import { Skeleton } from '@/components/ui/feedback/Skeleton';

export default function AdminDashboard() {
  const { data: quizzes, isLoading, refetch } = useGetQuizzesQuery({}, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  // Фильтры и сортировка для админки
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);


  // Загрузка категорий для фильтра
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Ошибка загрузки категорий:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/quizzes/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Ошибка удаления');
      success('Квиз удалён');
      refetch();
    } catch (err: any) {
      showError(err.message);
    } finally {
      setDeleteId(null);
    }
  };

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
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'alphabetical':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'popular':
        return sorted.sort((a, b) => (b._count?.attempts || 0) - (a._count?.attempts || 0));
      default:
        return sorted;
    }
  }, [filteredQuizzes, sortBy]);

  if (isLoading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-(--loom-white)/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-(--loom-white)">Управление квизами</h1>
        <Link href="/admin/quiz/new">
          <Button variant="glitch">
            <Plus size={16} className="mr-2" />
            Создать квиз
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <Link href="/admin/categories">
          <Button variant="secondary" size="sm">
            Управление категориями
          </Button>
        </Link>
      </div>

      {/* ФИЛЬТРЫ ДЛЯ АДМИНКИ */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm text-(--loom-white)/60">Категории:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categoriesLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-7 w-16 rounded-full shrink-0" />
              ))}
            </>
          ) : (
            <>
              <button
                onClick={() => setCategoryFilter('all')}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-full transition-colors whitespace-nowrap',
                  categoryFilter === 'all'
                    ? 'bg-(--loom-cyan)/20 text-(--loom-cyan)'
                    : 'bg-(--loom-white)/5 text-(--loom-white)/60 hover:bg-(--loom-white)/10'
                )}
              >
                Все
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={cn(
                    'px-3 py-1.5 text-xs rounded-full transition-colors whitespace-nowrap',
                    categoryFilter === cat.id
                      ? 'bg-(--loom-cyan)/20 text-(--loom-cyan)'
                      : 'bg-(--loom-white)/5 text-(--loom-white)/60 hover:bg-(--loom-white)/10'
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm text-(--loom-white)/60">Уровень:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setLevelFilter('all')}
            className={cn(
              'px-3 py-1.5 text-xs rounded-full transition-colors whitespace-nowrap',
              levelFilter === 'all'
                ? 'bg-(--loom-cyan)/20 text-(--loom-cyan)'
                : 'bg-(--loom-white)/5 text-(--loom-white)/60 hover:bg-(--loom-white)/10'
            )}
          >
            Все
          </button>
          {['JUNIOR', 'MIDDLE', 'SENIOR'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={cn(
                'px-3 py-1.5 text-xs rounded-full transition-colors whitespace-nowrap',
                levelFilter === lvl
                  ? 'bg-(--loom-cyan)/20 text-(--loom-cyan)'
                  : 'bg-(--loom-white)/5 text-(--loom-white)/60 hover:bg-(--loom-white)/10'
              )}
            >
              {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* СОРТИРОВКА */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm text-(--loom-white)/60 flex items-center gap-1">
            <Filter size={16} /> Сортировка:
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {['newest', 'popular', 'alphabetical'].map((option) => (
            <Button
              key={option}
              variant={sortBy === option ? 'glitch' : 'secondary'}
              size="sm"
              onClick={() => setSortBy(option)}
              className="px-4 py-1.5 text-xs shrink-0"
            >
              {option === 'newest' && 'Новые'}
              {option === 'popular' && 'Популярные'}
              {option === 'alphabetical' && 'По алфавиту'}
            </Button>
          ))}
        </div>
      </div>

      {/* СПИСОК КВИЗОВ */}
      {sortedQuizzes.length === 0 ? (
        <div className="text-center py-16 text-(--loom-white)/60">
          <p>Нет квизов по выбранным фильтрам</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedQuizzes.map((quiz: any) => (
            <Card key={quiz.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <h2 className="text-(--loom-white) font-semibold text-lg">{quiz.title}</h2>
                <div className="flex flex-wrap gap-2 text-sm text-(--loom-white)/60 mt-1">
                  <span>
                    {quiz._count?.questions || 0} {pluralize(quiz._count?.questions || 0, 'вопрос', 'вопроса', 'вопросов')}
                  </span>
                  <span>•</span>
                  <span>
                    {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString('ru') : '—'}
                  </span>
                  {quiz.category?.name && (
                    <>
                      <span>•</span>
                      <span className="text-(--loom-cyan)">{quiz.category.name}</span>
                    </>
                  )}
                  {quiz.level && (
                    <>
                      <span>•</span>
                      <span className="text-(--glitch-pink)">
                        {quiz.level.charAt(0) + quiz.level.slice(1).toLowerCase()}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link href={`/quiz/${quiz.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye size={14} className="mr-1" />
                    Смотреть
                  </Button>
                </Link>
                <Link href={`/admin/quiz/${quiz.id}`}>
                  <Button variant="outline" size="sm">
                    <Pencil size={14} className="mr-1" />
                    Ред.
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => setDeleteId(quiz.id)}
                >
                  <Trash2 size={14} className="mr-1" />
                  Удалить
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Удалить квиз?"
        confirmText="Удалить"
        cancelText="Отмена"
      >
        <p>Вы уверены? Это действие нельзя отменить.</p>
      </Modal>
    </div>
  );
}