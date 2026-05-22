'use client';

import { useState } from 'react';
import { useGetQuizzesQuery } from '@/store/api/quizApi';
import Link from 'next/link';
import { Button } from '@/components/ui/core/Button';
import { Modal } from '@/components/ui/feedback/Modal';
import { useToast } from '@/components/ui/feedback/ToastContainer';

export default function AdminDashboard() {
  const { data: quizzes, isLoading, refetch } = useGetQuizzesQuery({}, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { success, error: showError } = useToast();

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

  if (isLoading) return <p className="text-loom-white">Загрузка...</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-loom-white">Управление квизами</h1>
        <Link href="/admin/quiz/new">
          <Button>+ Создать квиз</Button>
        </Link>
      </div>

      {quizzes?.length === 0 ? (
        <p className="text-loom-white/60">Нет квизов. Создайте первый.</p>
      ) : (
        <div className="space-y-3">
          {quizzes?.map((quiz: any) => (
            <div
              key={quiz.id}
              className="flex items-center justify-between p-4 bg-loom-dark-secondary rounded-lg"
            >
              <div>
                <h2 className="text-loom-white font-semibold">{quiz.title}</h2>
                <p className="text-loom-white/60 text-sm">
                  Вопросов: {quiz._count?.questions ?? 0} ·{' '}
                  {new Date(quiz.updated_at).toLocaleDateString('ru')}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/quiz/${quiz.id}`}>
                  <Button variant="ghost" size="sm">Смотреть</Button>
                </Link>
                <Link href={`/admin/quiz/${quiz.id}`}>
                  <Button variant="outline" size="sm">Ред.</Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-400"
                  onClick={() => setDeleteId(quiz.id)}
                >
                  Удалить
                </Button>
              </div>
            </div>
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