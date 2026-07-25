'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/core/Card';
import { StarButton } from '@/components/ui/core/StarButton';
import { cn, pluralize } from '@/lib/utils';

interface CatalogCardProps {
  quiz: {
    id: string;
    title: string;
    level: string;
    category: {
      id: string;
      name: string;
      iconUrl?: string | null;
    } | null;
    _count?: {
      questions: number;
      attempts: number;
    };
  };
  lastAttempt?: {
    score: number;
    totalQuestions: number;
  } | null;
  className?: string;
}

export function CatalogCard({ quiz, lastAttempt, className }: CatalogCardProps) {
  const router = useRouter();

  return (
    <Card
      className={cn('cursor-pointer hover:scale-[1.01] transition-transform duration-200', className)}
      onClick={() => router.push(`/quiz/${quiz.id}/preview`)}
    >
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-xl">{quiz.title}</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-(--loom-white)/60">В избранное</span>
          <StarButton quizId={quiz.id} size={22} />
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col gap-1 relative">
        <div className="flex justify-between items-center text-sm text-(--loom-white)/60">
          <span>
            {quiz._count?.questions || 0}{' '}
            {pluralize(quiz._count?.questions || 0, 'вопрос', 'вопроса', 'вопросов')}
          </span>

          <div className="flex flex-col items-end relative">
            <div className="absolute -top-14 right-0">
              {quiz.category?.iconUrl ? (
                <img
                  src={quiz.category.iconUrl}
                  alt={quiz.category.name}
                  className="w-11 h-11 rounded-full object-contain"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-(--loom-cyan)/20 flex items-center justify-center text-sm text-(--loom-cyan) font-bold">
                  {quiz.category?.name?.[0] || '?'}
                </div>
              )}
            </div>
            <span className="text-(--loom-cyan) text-lg font-medium">
              {quiz.category?.name || 'Без категории'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {lastAttempt && (
            <>
              <span
                className={cn(
                  'font-semibold',
                  lastAttempt.score === lastAttempt.totalQuestions && 'text-(--loom-cyan)',
                  lastAttempt.score < lastAttempt.totalQuestions && 'text-(--loom-yellow)'
                )}
              >
                {lastAttempt.score}/{lastAttempt.totalQuestions}
              </span>
              <span className="text-(--loom-white)/30">•</span>
            </>
          )}
          <span className="text-(--loom-white)/40">
            {quiz.level ? quiz.level.charAt(0) + quiz.level.slice(1).toLowerCase() : 'Любой'}
          </span>
          {quiz.level && (
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                quiz.level === 'JUNIOR' && 'bg-(--loom-cyan)',
                quiz.level === 'MIDDLE' && 'bg-(--loom-yellow)',
                quiz.level === 'SENIOR' && 'bg-(--glitch-pink)'
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}