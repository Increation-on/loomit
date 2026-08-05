'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useGetAttemptByIdQuery } from '@/store/api/profileApi';
import { useGetQuizByIdQuery } from '@/store/api/quizApi';
import { Check, X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/feedback/Skeleton';

export default function AttemptDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const quizId = searchParams.get('quizId');

  const { data: attempt, isLoading: attemptLoading } = useGetAttemptByIdQuery(id);
  
  // ✅ Если quizId не передан в URL, берём его из попытки
  const effectiveQuizId = quizId || attempt?.quiz_id;

  const { data: quiz, isLoading: quizLoading } = useGetQuizByIdQuery(effectiveQuizId ?? '', {
    skip: !effectiveQuizId,
  });

  const isLoading = attemptLoading || (effectiveQuizId ? quizLoading : false);

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <p className="text-(--loom-white)/60">Попытка не найдена</p>
      </div>
    );
  }

  const scorePercent = Math.round((attempt.score / attempt.totalQuestions) * 100);

  return (
    <div className="p-6 max-w-2xl mx-auto pb-24 space-y-8">
      <Link
        href="/profile/history"
        className="flex items-center gap-2 text-(--loom-white)/60 hover:text-(--loom-white) transition-colors text-sm"
      >
        <ArrowLeft size={16} />
        Назад к истории
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-(--loom-white) mb-2">{attempt.quizTitle}</h1>
        <div className="flex flex-wrap gap-4 text-(--loom-white)/60">
          <span>
            Результат: <span className="text-(--loom-yellow) font-semibold">{attempt.score}/{attempt.totalQuestions}</span>
          </span>
          <span>•</span>
          <span>{scorePercent}%</span>
          <span>•</span>
          <span>{new Date(attempt.createdAt).toLocaleDateString('ru')}</span>
        </div>
      </div>

      <div className="space-y-4">
        {attempt.answers?.map((a: any, i: number) => {
          const isCorrect = a.isCorrect ?? false;
          const question = a;

          const getSelectedText = (a: any, question: any) => {
            const selectedId = a.selectedOptionId || a.selected_option_id;
            const options = question?.options || [];

            const found = options.find((o: any) => o.id === selectedId);
            if (found) return found.text;

            if (typeof options[0] === 'string') {
              const index = parseInt(selectedId) - 1;
              if (index >= 0 && index < options.length) {
                return options[index];
              }
            }

            return selectedId;
          };

          const getCorrectText = (a: any, question: any) => {
            const correctId = a.correctOptionId;
            if (!correctId) return '—';

            const options = question?.options || [];

            const found = options.find((o: any) => String(o.id) === String(correctId));
            if (found) return found.text;

            if (typeof options[0] === 'string') {
              const index = parseInt(correctId as string) - 1;
              if (index >= 0 && index < options.length) {
                return options[index];
              }
            }

            return correctId;
          };

          // ✅ Находим объяснение по индексу вопроса
          const explanation = quiz?.questions?.[i]?.explanation;

          return (
            <div
              key={i}
              className={cn(
                'p-4 bg-(--loom-white)/5 rounded-xl glitch-border flex items-start gap-4 transition-colors',
                isCorrect ? 'border-l-4 border-(--loom-cyan)' : 'border-l-4 border-(--glitch-pink)'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                isCorrect ? 'bg-(--loom-cyan)/20 text-(--loom-cyan)' : 'bg-(--glitch-pink)/20 text-(--glitch-pink)'
              )}>
                {isCorrect ? <Check size={16} /> : <X size={16} />}
              </div>

              <div className="flex-1 space-y-1">
                <p className="text-(--loom-white) font-medium text-sm">
                  {i + 1}. {a.questionText || 'Вопрос'}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="text-(--loom-white)/60">
                    Ваш ответ:{' '}
                    <span className={isCorrect ? 'text-(--loom-cyan)' : 'text-(--glitch-pink)'}>
                      {getSelectedText(a, question)}
                    </span>
                  </span>
                  {!isCorrect && (
                    <span className="text-(--loom-cyan)">
                      <span className='text-(--loom-yellow)'> Правильный: </span>{getCorrectText(a, question)}
                    </span>
                  )}
                </div>

                {/* ✅ Отображение объяснения */}
                {explanation && (
                  <div className="mt-2 text-sm text-(--loom-white)/60 bg-(--loom-white)/5 p-3 rounded-lg">
                    <span className="text-(--loom-cyan) font-medium">Объяснение: </span>
                    {explanation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}