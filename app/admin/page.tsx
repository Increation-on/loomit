// app\admin\page.tsx

'use client';

import { useState, useMemo } from 'react';
import { useGetQuizzesQuery } from '@/store/api/quizApi';
import Link from 'next/link';
import { Button } from '@/components/ui/core/Button';
import { Modal } from '@/components/ui/feedback/Modal';
import { Card } from '@/components/ui/core/Card';
import { useToast } from '@/components/ui/feedback/ToastContainer';
import { Plus, Pencil, Eye, Trash2 } from 'lucide-react';
import { cn, pluralize } from '@/lib/utils';
import { Filters } from '@/components/ui/core/Filters';
import { Skeleton, AdminQuizRowSkeleton } from '@/components/ui/feedback/Skeleton';
import { useNavigationTransition } from '@/components/layout/NavigationProvider';
import { useRouter } from 'next/navigation';
import { usePageHeader } from '@/hooks/usePageHeader';
import { PageContentTitle } from '@/components/ui/core/PageContentTitle';

export default function AdminDashboard() {
  const {
    data: quizzes,
    isLoading,
    refetch,
  } = useGetQuizzesQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const router = useRouter();
  const { setQuizOrigin } = useNavigationTransition();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  usePageHeader({ variant: 'tab', title: 'Управление квизами', showBack: true });

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
        return sorted.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
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
      <div className="mx-auto max-w-4xl p-4 pb-24">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
        <div className="mb-4">
          <Skeleton className="h-8 w-48 rounded-full" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <AdminQuizRowSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 pb-24">
      
      {/* Умный заголовок (скроется в PWA) */}
      <PageContentTitle 
        title="Управление квизами" 
        showBack={false} 
        className="mb-6" 
      />

      {/* Контейнер для кнопок в один ряд */}
      <div className="mb-6 flex w-full items-stretch gap-2 sm:gap-3">
        
        {/* Кнопка "Управление категориями" */}
        <Link href="/admin/categories" className="flex-1">
          <Button variant="secondary" className="w-full px-2 text-xs sm:text-sm">
            Управление категориями
          </Button>
        </Link>

        {/* Кнопка "Создать квиз" */}
        <Link href="/admin/quiz/new" className="flex-1">
          <Button variant="glitch" className="w-full px-2 text-xs sm:text-sm">
            <Plus size={16} className="mr-1 shrink-0" />
            Создать квиз
          </Button>
        </Link>
        
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
        <div className="mt-3 py-16 text-center text-(--loom-white)/60">
          <p>Нет квизов по выбранным фильтрам</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedQuizzes.map((quiz: any) => (
            <Card
              key={quiz.id}
              className="mt-4 flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-(--loom-white)">{quiz.title}</h2>
                <div className="mt-1 flex flex-wrap gap-2 text-sm text-(--loom-white)/60">
                  <span>
                    {quiz._count?.questions || 0}{' '}
                    {pluralize(quiz._count?.questions || 0, 'вопрос', 'вопроса', 'вопросов')}
                  </span>
                  <span>•</span>
                  <span>
                    {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString('ru') : '—'}
                  </span>
                  {quiz.category?.name && (
                    <>
                      <span>•</span>
                      <span className="text-(--loom-magenta)">{quiz.category.name}</span>
                    </>
                  )}
                  {quiz.level && (
                    <>
                      <span>•</span>
                      <span
                        className={cn(
                          'text-(--loom-white)/40',
                          quiz.level === 'JUNIOR' && 'text-(--loom-cyan)',
                          quiz.level === 'MIDDLE' && 'text-(--loom-yellow)',
                          quiz.level === 'SENIOR' && 'text-(--glitch-pink)'
                        )}
                      >
                        {quiz.level.charAt(0) + quiz.level.slice(1).toLowerCase()}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setQuizOrigin('/admin');
                    router.push(`/quiz/${quiz.id}/preview`);
                  }}
                >
                  <Eye size={14} className="mr-1" />
                  Смотреть
                </Button>
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
