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
  const progressPercent = Math.min(
    Math.round((answersCount / totalQuestions) * 100),
    100
  );

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
        'w-full h-46 bg-(--loom-cyan)/10 p-5 rounded-xl glitch-border flex flex-col justify-between relative overflow-hidden',
        'transition-all duration-300 hover:bg-(--loom-cyan)/15',
        className
      )}
    >
      {/* Медленная глитч-линия на фоне для атмосферы */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute left-0 right-0 mx-auto w-full h-0.5 bg-linear-to-r from-transparent via-(--loom-cyan) to-transparent animate-scanline" />
      </div>

      {/* Верхний контентный блок полностью изолирован */}
      <div className="relative z-10 flex flex-col flex-1 justify-between">
        
        {/* Шапка карточки */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-(--loom-cyan) font-bold tracking-wider uppercase flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-(--loom-cyan)" />
            Незавершённый квиз
          </span>
          <span className="text-xs font-mono text-(--loom-white)/30 uppercase tracking-widest">
            {totalQuestions} {pluralize(totalQuestions, 'вопрос', 'вопроса', 'вопросов')}
          </span>
        </div>

        {/* ⚡ Контейнер заголовка: строго items-start для безопасности хука + mb-1 для свободного пространства */}
        <div 
          ref={titleRef} 
          className="h-12 flex items-start overflow-hidden min-h-0 w-full mt-3 mb-1"
        >
          <h3 
            className="font-display font-bold text-center text-(--loom-white) leading-tight tracking-wide w-full wrap-break-word"
            style={{ 
              fontSize: `${fontSize}px`,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {title}
          </h3>
        </div>

        {/* Информационный блок прогресс-бара с явным нижним отступом от кнопок */}
        <div className="space-y-2 mb-4">
          <div className="w-full h-1 bg-(--loom-white)/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-(--loom-cyan) transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-mono">
            <div className="text-(--loom-white)/50">
              Пройдено: <span className="text-(--loom-cyan) font-bold">{answersCount}</span> / {totalQuestions}
            </div>
            <div className="text-(--loom-cyan)/70">
              {progressPercent}%
            </div>
          </div>
        </div>

      </div>

      {/* Кнопки действий: жестко прижаты книзу за счет flex-1 у верхнего блока */}
      <div className="flex gap-3 relative z-10 shrink-0">
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
          className="flex-1 py-2 border border-(--glitch-pink)/30 hover:border-(--glitch-pink) text-(--loom-white)/80 hover:text-(--glitch-pink) transition-colors" 
          onClick={onCancel}
          disabled={isCancelling}
        >
          {isCancelling ? 'Сброс...' : 'Отменить'}
        </Button>
      </div>
    </div>
  );
}
