'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

import { Card } from '@/components/ui/core/Card';
import { StarButton } from '@/components/ui/core/StarButton';
import { Button } from '@/components/ui/core/Button';
import { cn, pluralize } from '@/lib/utils';

interface CatalogCardProps {
  quiz: {
    id: string;
    title: string;
    description?: string | null;
    level: string;
    category: {
      id: string;
      name: string;
      iconUrl?: string | null;
    } | null;
    questions?: {
      id: string;
    }[];
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
  showFavorite?: boolean;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
}

export function CatalogCard({
  quiz,
  lastAttempt,
  className,
  showFavorite = false,
  isFavorited = false,
  onFavoriteToggle,
}: CatalogCardProps) {
  const router = useRouter();

  const levelLabel = quiz.level
    ? quiz.level.charAt(0) + quiz.level.slice(1).toLowerCase()
    : 'Любой';

  const levelDotColor = cn(
    quiz.level === 'JUNIOR' && 'bg-(--loom-cyan)',
    quiz.level === 'MIDDLE' && 'bg-(--loom-yellow)',
    quiz.level === 'SENIOR' && 'bg-(--glitch-pink)'
  );

  const questionsCount = quiz._count?.questions ?? quiz.questions?.length ?? 0;

  return (
    <Card className={cn('overflow-hidden flex flex-row p-4 gap-3 h-39', className)}>
      {/* Левая часть */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Заголовок */}
        <div className="flex items-start gap-3 h-13">
          <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden bg-(--loom-black) border border-(--loom-white)/10 flex items-center justify-center">
            {quiz.category?.iconUrl ? (
              <img
                src={quiz.category.iconUrl}
                alt={quiz.category.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-(--loom-cyan) font-bold text-lg">
                {quiz.category?.name?.[0] || '?'}
              </span>
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <h3 className="text-lg font-semibold text-(--loom-white) truncate">{quiz.title}</h3>
            <p className="text-sm text-(--loom-white)/60 line-clamp-1 min-h-5">
              {quiz.description || ' '}
            </p>
          </div>
        </div>

        {/* Теги */}
        <div className="flex flex-wrap items-center gap-3 text-xs mt-2">
          <span className="text-(--loom-white)/50">
            {questionsCount}{' '}
            {pluralize(questionsCount, 'вопрос', 'вопроса', 'вопросов')}
          </span>

          <div className="flex items-center gap-1.5">
            <span className={cn('w-1.5 h-1.5 rounded-full', levelDotColor)} />
            <span className="text-(--loom-white)/50">{levelLabel}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-(--loom-white)/20">●</span>
            <span className="text-(--loom-magenta)">{quiz.category?.name || 'Без категории'}</span>
          </div>

          {lastAttempt && (
            <>
              <span className="text-(--loom-white)/20">●</span>
              <span
                className={cn(
                  'font-semibold',
                  lastAttempt.score === lastAttempt.totalQuestions
                    ? 'text-(--loom-cyan)'
                    : 'text-(--loom-yellow)'
                )}
              >
                {lastAttempt.score}/{lastAttempt.totalQuestions}
              </span>
            </>
          )}
        </div>

        {/* Кнопка */}
        <div className="mt-auto pt-2">
          <Button
            variant="outline"
            className="w-full glitch-border text-(--loom-cyan) hover:text-(--loom-white) hover:bg-(--loom-cyan)/10 transition-all flex items-center justify-center relative"
            onClick={() => router.push(`/quiz/${quiz.id}/preview`)}
          >
            <span>Открыть квиз</span>
            <ChevronRight size={22} className="absolute right-2" />
          </Button>
        </div>
      </div>

      {/* Правая часть */}
      {showFavorite && (
        <div className="relative flex items-center justify-center shrink-0 w-12 h-full pl-3">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-[80%] overflow-hidden bg-(--loom-white)/10">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-(--loom-yellow)/0 via-(--loom-magenta) to-(--loom-cyan)/0 shadow-[0_0_10px_var(--loom-magenta)] drop-shadow-[0_0_12px_var(--loom-cyan)] animate-divider-flow" />
          </div>

          <StarButton
            active={isFavorited}
            size={28}
            className="hover:scale-110 transition-transform"
            onClick={onFavoriteToggle ?? (() => {})}
          />
        </div>
      )}
    </Card>
  );
}