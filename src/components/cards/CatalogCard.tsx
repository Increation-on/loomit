'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

import { Card } from '@/components/ui/core/Card';
import { StarButton } from '@/components/ui/core/StarButton';
import { Button } from '@/components/ui/core/Button';
import { cn, pluralize } from '@/lib/utils';
import { useNavigationTransition } from '../layout/NavigationProvider';
import { InlineCodeText } from '@/components/ui/core/InlineCodeText';

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
  origin?: string;
}

export function CatalogCard({
  quiz,
  lastAttempt,
  className,
  showFavorite = false,
  isFavorited = false,
  onFavoriteToggle,
  origin = '/catalog',
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
  const attemptsCount = quiz._count?.attempts ?? 0;

  const { setQuizOrigin } = useNavigationTransition();

  return (
    <Card className={cn('flex min-h-39 flex-row gap-3 overflow-hidden p-4', className)}>
      {/* Левая часть */}
      <div className="flex h-full min-w-0 flex-1 flex-col">
        {/* Заголовок */}
        <div className="flex h-13 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-(--loom-white)/10 bg-(--loom-black)">
            {quiz.category?.iconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={quiz.category.iconUrl}
                alt={quiz.category.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-lg font-bold text-(--loom-cyan)">
                {quiz.category?.name?.[0] || '?'}
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-col">
            <h3 className="line-clamp-2 text-lg leading-tight font-semibold text-(--loom-white)">
              {quiz.title}
            </h3>
            <p className="line-clamp-1 min-h-5 text-sm text-(--loom-white)/60">
              {quiz.description ? (
                <InlineCodeText
                  value={quiz.description}
                  codeClassName="bg-(--loom-yellow)/10 text-(--loom-yellow) text-[0.8em]"
                />
              ) : (
                ' '
              )}
            </p>
          </div>
        </div>

        {/* Теги */}
        <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs">
          <span className="whitespace-nowrap text-(--loom-white)/50">
            {questionsCount} {pluralize(questionsCount, 'вопрос', 'вопроса', 'вопросов')}
          </span>

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-(--loom-white)/20">●</span>
            <span className="max-w-25 truncate text-(--loom-magenta) md:max-w-35">
              {quiz.category?.name || 'Без категории'}
            </span>
            <span className="text-(--loom-white)/20">●</span>
          </div>

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-(--loom-white)/50">{levelLabel}</span>
            <span className={cn('h-1.5 w-1.5 rounded-full', levelDotColor)} />
          </div>

          {/* Общее количество попыток + последняя попытка — в одной строке */}
          {(attemptsCount > 0 || lastAttempt) && (
            <>
              {attemptsCount > 0 && (
                <span className="whitespace-nowrap text-(--loom-white)/50">
                  {attemptsCount} {pluralize(attemptsCount, 'попытка', 'попытки', 'попыток')}
                </span>
              )}
              <div className="flex min-h-5 min-w-10 items-center justify-center">
                {lastAttempt ? (
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      lastAttempt.score === lastAttempt.totalQuestions
                        ? 'text-(--loom-cyan)'
                        : 'text-(--loom-yellow)'
                    )}
                  >
                    {lastAttempt.score}/{lastAttempt.totalQuestions}
                  </span>
                ) : (
                  <div className="h-4 w-10 animate-pulse rounded bg-(--loom-white)/5" />
                )}
              </div>
            </>
          )}
        </div>

        {/* Кнопка */}
        <div className="mt-auto pt-2">
          <Button
            variant="outline"
            className="glitch-border relative flex w-full items-center justify-center text-(--loom-cyan) transition-all hover:bg-(--loom-cyan)/10 hover:text-(--loom-white)"
            onClick={() => {
              setQuizOrigin(origin);
              router.push(`/quiz/${quiz.id}/preview`);
            }}
          >
            <span>Открыть квиз</span>
            <ChevronRight size={22} className="absolute right-2" />
          </Button>
        </div>
      </div>

      {/* Правая часть */}
      {showFavorite && (
        <div className="relative flex h-full w-12 shrink-0 items-center justify-center pl-3">
          <div className="absolute top-1/2 left-0 h-[80%] w-px -translate-y-1/2 overflow-hidden bg-(--loom-white)/10">
            <div className="animate-divider-flow absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-(--loom-yellow)/0 via-(--loom-magenta) to-(--loom-cyan)/0 shadow-[0_0_10px_var(--loom-magenta)] drop-shadow-[0_0_12px_var(--loom-cyan)]" />
          </div>

          <StarButton
            active={isFavorited}
            size={28}
            className="transition-transform hover:scale-110"
            onClick={onFavoriteToggle ?? (() => {})}
          />
        </div>
      )}
    </Card>
  );
}
