// app\admin\page.tsx

'use client';

import { useState } from 'react';
import { useGetQuizzesQuery } from '@/store/api/quizApi';
import Link from 'next/link';
import { Button } from '@/components/ui/core/Button';
import { Modal } from '@/components/ui/feedback/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/core/Card';
import { useToast } from '@/components/ui/feedback/ToastContainer';
import { Plus, Pencil, Eye, Trash2 } from 'lucide-react';


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

      {/* Ссылка на управление категориями */}
      <div className="mb-6">
        <Link href="/admin/categories">
          <Button variant="secondary" size="sm">
            Управление категориями
          </Button>
        </Link>
      </div>

      {quizzes?.length === 0 ? (
        <div className="text-center py-16 text-(--loom-white)/60">
          <p>Пока нет квизов. Создайте первый!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {quizzes?.map((quiz: any) => (
            <Card key={quiz.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <h2 className="text-(--loom-white) font-semibold text-lg">{quiz.title}</h2>
                <div className="flex flex-wrap gap-2 text-sm text-(--loom-white)/60 mt-1">
                  <span>{quiz._count?.questions ?? 0} вопросов</span>
                  <span>•</span>
                  <span>{new Date(quiz.updated_at).toLocaleDateString('ru')}</span>
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