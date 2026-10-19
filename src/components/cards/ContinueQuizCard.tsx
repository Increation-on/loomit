'use client';

import { cn, pluralize } from '@/lib/utils';
import { Button } from '@/components/ui/core/Button';
import { useQuizFontSize } from '@/hooks/useQuizFontSize'; // Возвращаем хук на место

interface ContinueQuizCardProps {
  title: string;
  answersCount: number;
  totalQuestions?: number;
  isCancelling?: boolean;
  onContinue: () => void;
  onCancel: () => void;
  className?: string;
}

export function ContinueQuizCard({
  title,
  answersCount,
  totalQuestions = 10,
  isCancelling = false,
  onContinue,
  onCancel,
  className,
}: ContinueQuizCardProps) {
  const progressPercent = Math.min(Math.round((answersCount / totalQuestions) * 100), 100);

  // Подключаем хук адаптивного шрифта с безопасными границами
  const { fontSize, ref: titleRef } = useQuizFontSize({
    text: title,
    minFontSize: 13,
    maxFontSize: 18,
    step: 0.5,
  });

  return (
    <div
      className={cn(
        'glitch-border relative flex h-46 w-full flex-col justify-between overflow-hidden rounded-xl bg-(--loom-cyan)/10 p-5',
        'transition-all duration-300 hover:bg-(--loom-cyan)/15',
        className
      )}
    >
      {/* Медленная глитч-линия на фоне для атмосферы */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="animate-scanline absolute right-0 left-0 mx-auto h-0.5 w-full bg-linear-to-r from-transparent via-(--loom-cyan) to-transparent" />
      </div>

      {/* Верхний контентный блок полностью изолирован */}
      <div className="relative z-10 flex flex-1 flex-col justify-between">
        {/* Шапка карточки */}
        <div className="flex items-center justify-between">
          <span className="flex animate-pulse items-center gap-1.5 text-xs font-bold tracking-wider text-(--loom-cyan) uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-(--loom-cyan)" />
            Незавершённый квиз
          </span>
          <span className="font-mono text-xs tracking-widest text-(--loom-white)/30 uppercase">
            {totalQuestions} {pluralize(totalQuestions, 'вопрос', 'вопроса', 'вопросов')}
          </span>
        </div>

        {/* ⚡ Контейнер заголовка: строго items-start для безопасности хука + mb-1 для свободного пространства */}
        <div
          ref={titleRef}
          className="mt-3 mb-1 flex h-12 min-h-0 w-full items-start overflow-hidden"
        >
          <h3
            className="font-display w-full text-center leading-tight font-bold tracking-wide wrap-break-word text-(--loom-white)"
            style={{
              fontSize: `${fontSize}px`,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </h3>
        </div>

        {/* Информационный блок прогресс-бара с явным нижним отступом от кнопок */}
        <div className="mb-4 space-y-2">
          <div className="h-1 w-full overflow-hidden rounded-full bg-(--loom-white)/10">
            <div
              className="h-full bg-(--loom-cyan) transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between font-mono text-[11px]">
            <div className="text-(--loom-white)/50">
              Пройдено: <span className="font-bold text-(--loom-cyan)">{answersCount}</span> /{' '}
              {totalQuestions}
            </div>
            <div className="text-(--loom-cyan)/70">{progressPercent}%</div>
          </div>
        </div>
      </div>

      {/* Кнопки действий: жестко прижаты книзу за счет flex-1 у верхнего блока */}
      <div className="relative z-10 flex shrink-0 gap-3">
        <Button
          variant="glitch"
          size="sm"
          className="flex-1 py-2"
          onClick={onContinue}
          disabled={isCancelling}
        >
          Продолжить
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 border border-(--glitch-pink)/30 py-2 text-(--loom-white)/80 transition-colors hover:border-(--glitch-pink) hover:text-(--glitch-pink)"
          onClick={onCancel}
          disabled={isCancelling}
        >
          {isCancelling ? 'Сброс...' : 'Отменить'}
        </Button>
      </div>
    </div>
  );
}
