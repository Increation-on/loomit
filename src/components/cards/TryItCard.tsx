'use client';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { InlineCodeText } from '@/components/ui/core/InlineCodeText';

interface TryItCardProps {
  quiz: {
    id: string;
    title: string;
    description?: string | null;
    level: string;
    category?: {
      name: string;
      iconUrl?: string | null;
    } | null;
  };
  lastAttempt?: {
    score: number;
    totalQuestions: number;
  } | null;
  isActive?: boolean;
  isClicked?: boolean;
  onClick?: () => void;
}

export function TryItCard({
  quiz,
  lastAttempt,
  isActive = false,
  isClicked = false,
  onClick,
}: TryItCardProps) {
  const router = useRouter();

  const levelColor = cn(
    quiz.level === 'JUNIOR' && 'text-(--loom-cyan)',
    quiz.level === 'MIDDLE' && 'text-(--loom-yellow)',
    quiz.level === 'SENIOR' && 'text-(--glitch-pink)'
  );

  const levelLabel = quiz.level ? quiz.level.charAt(0) + quiz.level.slice(1).toLowerCase() : '';

  return (
    <div
      onClick={onClick}
      className={cn(
        'try-it-card relative flex h-46 w-50 shrink-0 cursor-pointer snap-start flex-col rounded-xl bg-(--loom-cyan)/20 p-4 transition-all duration-300',
        (isActive || isClicked) && 'snake-active'
      )}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {quiz.category?.iconUrl ? (
            <img
              src={quiz.category.iconUrl}
              alt=""
              className="h-9 w-9 rounded-full object-contain"
            />
          ) : (
            <div className="text-l flex h-9 w-9 items-center justify-center rounded-full bg-(--loom-cyan)/20 font-bold text-(--loom-cyan)">
              {quiz.category?.name?.[0] || '?'}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex min-h-5 min-w-10 items-center justify-center">
            {lastAttempt ? (
              <span
                className={cn(
                  'text-xs font-semibold',
                  lastAttempt.score === lastAttempt.totalQuestions && 'text-(--loom-cyan)',
                  lastAttempt.score < lastAttempt.totalQuestions && 'text-(--loom-yellow)'
                )}
              >
                {lastAttempt.score}/{lastAttempt.totalQuestions}
              </span>
            ) : (
              <div className="h-4 w-10 animate-pulse rounded bg-(--loom-white)/5" />
            )}
          </div>
          <span className="text-(--loom-white)/30">•</span>
          {quiz.level && (
            <span className={cn('text-xs font-semibold', levelColor)}>{levelLabel}</span>
          )}
        </div>
      </div>
      <h3 className="mt-1 truncate text-lg leading-tight font-bold text-(--loom-white)">
        {quiz.title}
      </h3>
      <p className="mt-1 line-clamp-4 flex-1 text-sm text-(--loom-white)/60">
        {quiz.description && (
          <InlineCodeText
            value={quiz.description}
            codeClassName="bg-(--loom-yellow)/10 text-(--loom-yellow) text-[0.8em]"
          />
        )}
      </p>
    </div>
  );
}
