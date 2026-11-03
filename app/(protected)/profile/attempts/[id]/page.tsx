// app/profile/attempts/[id]/page.tsx

'use client';

import { useParams } from 'next/navigation';
import { useGetAttemptByIdQuery } from '@/store/api/profileApi';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/feedback/Skeleton';
import { usePageHeader } from '@/hooks/usePageHeader';
import { PageContentTitle } from '@/components/ui/core/PageContentTitle';
import { InlineCodeText } from '@/components/ui/core/InlineCodeText';
import { prepareQuestionContent } from '@/lib/utils/quiz';
import { QuestionCodeBlock } from '@/components/quiz/QuizQuestion/QuestionCodeBlock';

export default function AttemptDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: attempt, isLoading } = useGetAttemptByIdQuery(id);

  usePageHeader({
    variant: 'nested',
    title: 'Разбор ответов',
    showBack: true,
    fallback: '/profile/history',
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-6">
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
      <div className="mx-auto max-w-2xl p-6">
        <p className="text-(--loom-white)/60">Попытка не найдена</p>
      </div>
    );
  }

  const scorePercent = Math.round((attempt.score / attempt.totalQuestions) * 100);

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6 pb-24">
      <PageContentTitle
        title={attempt.quizTitle || 'Разбор ответов'}
        showBack={true}
        fallback="/profile/history"
        className="mb-4"
      />

      <div>
        <div className="flex flex-wrap gap-4 text-(--loom-white)/60">
          <span>
            Результат:{' '}
            <span className="font-semibold text-(--loom-yellow)">
              {attempt.score}/{attempt.totalQuestions}
            </span>
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

          const questionText = a.questionText || 'Вопрос';
          const questionParsed = prepareQuestionContent(questionText);

          const explanation = a.explanation;
          const explanationParsed = explanation ? prepareQuestionContent(explanation) : null;

          const selectedText = a.selectedOptionText || '—';
          const correctText = a.correctOptionText || '—';

          const questionCode = a.code ?? null;
          const questionCodeLang = a.codeLang ?? null;

          return (
            <div
              key={a.questionId ?? a.id ?? i}
              className={cn(
                'glitch-border flex items-start gap-4 rounded-xl bg-(--loom-white)/5 p-4 transition-colors',
                isCorrect ? 'border-l-4 border-(--loom-cyan)' : 'border-l-4 border-(--glitch-pink)'
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  isCorrect
                    ? 'bg-(--loom-cyan)/20 text-(--loom-cyan)'
                    : 'bg-(--glitch-pink)/20 text-(--glitch-pink)'
                )}
              >
                {isCorrect ? <Check size={16} /> : <X size={16} />}
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-sm font-medium text-(--loom-white)">
                  {i + 1}. <InlineCodeText value={questionParsed.inlineText} />
                </p>

                {questionCode && <QuestionCodeBlock code={questionCode} lang={questionCodeLang} />}

                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="text-(--loom-white)/60">
                    Ваш ответ:{' '}
                    <span className={isCorrect ? 'text-(--loom-cyan)' : 'text-(--glitch-pink)'}>
                      <InlineCodeText value={selectedText} />
                    </span>
                  </span>
                  {!isCorrect && (
                    <span className="text-(--loom-cyan)">
                      <span className="text-(--loom-yellow)"> Правильный: </span>
                      <InlineCodeText value={correctText} />
                    </span>
                  )}
                </div>

                {explanationParsed && (
                  <div className="mt-2 rounded-lg bg-(--loom-white)/5 p-3 text-sm text-(--loom-white)/60">
                    <span className="font-medium text-(--loom-cyan)">Объяснение: </span>
                    <InlineCodeText value={explanationParsed.inlineText} />
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
