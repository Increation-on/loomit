'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetQuizByIdQuery } from '@/store/api/quizApi';
import { Button } from '@/components/ui/core/Button';
import { Skeleton } from '@/components/ui/feedback/Skeleton';
import { cn } from '@/lib/utils';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export default function QuizPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: quiz, isLoading } = useGetQuizByIdQuery(id);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
        <p className="text-(--loom-white)/60">Квиз не найден</p>
      </div>
    );
  }

  const levelColors = {
    JUNIOR: 'text-(--loom-cyan)',
    MIDDLE: 'text-(--loom-yellow)',
    SENIOR: 'text-(--glitch-pink)',
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col p-4">
      {/* Кнопка назад */}
      <div className="max-w-md w-full mx-auto mb-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-(--loom-white)/60 hover:text-(--loom-white) transition-colors"
        >
          <ArrowLeft size={18} />
          Назад
        </button>
      </div>

      {/* Карточка по центру свободного пространства */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full bg-(--loom-white)/5 rounded-2xl p-8 glitch-border relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-0 right-0 mx-auto w-full h-0.75 glitch-scanline-gradient opacity-50 blur-[1px] animate-scanline" />
          </div>

          <div className="relative z-10 space-y-5 text-center">
            <div className="flex justify-center">
              {quiz.category?.iconUrl ? (
                <img
                  src={quiz.category.iconUrl}
                  alt={quiz.category.name}
                  className="w-20 h-20 rounded-full object-contain"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-(--loom-cyan)/20 flex items-center justify-center text-(--loom-cyan) text-3xl font-bold">
                  {quiz.category?.name?.[0] || '?'}
                </div>
              )}
            </div>

            <h1 className="text-2xl font-bold text-(--loom-white)">{quiz.title}</h1>

            {quiz.description && (
              <p className="text-(--loom-white)/60 text-base">{quiz.description}</p>
            )}

            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span className="text-(--loom-magenta) font-medium">{quiz.category?.name || 'Без категории'}</span>
              <span className="text-(--loom-white)/30">•</span>
              <span className={cn('font-semibold', levelColors[quiz.level as keyof typeof levelColors] || 'text-(--loom-white)/60')}>
                {quiz.level ? quiz.level.charAt(0) + quiz.level.slice(1).toLowerCase() : 'Любой уровень'}
              </span>
              <span className="text-(--loom-white)/30">•</span>
              <span className="text-(--loom-white)/60">
                {quiz.questions?.length || 0} вопросов
              </span>
            </div>

            <div className="pt-4">
              <Button
                variant="glitch"
                onClick={() => router.push(`/quiz/${id}`)}
                className="w-full py-3 text-base"
              >
                Начать квиз
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}