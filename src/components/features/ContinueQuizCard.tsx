'use client';

import { Button } from '@/components/ui/core/Button';
import { pluralize } from '@/lib/utils';

interface ContinueQuizCardProps {
  title: string;
  answersCount: number;
  onContinue: () => void;
  className?: string;
}

export function ContinueQuizCard({
  title,
  answersCount,
  onContinue,
  className,
}: ContinueQuizCardProps) {
  return (
    <div
      className={`bg-(--loom-white)/5 p-3 rounded-xl border border-(--loom-cyan)/30 flex items-center justify-between glitch-border ${className || ''}`}
    >
      <div className="flex flex-col">
        <span className="text-xs text-(--loom-white)/60">Продолжить</span>
        <span className="font-semibold text-(--loom-white) text-sm">{title}</span>
        <span className="text-[10px] text-(--loom-white)/40 mt-0.5">
          {answersCount} {pluralize(answersCount, 'вопрос', 'вопроса', 'вопросов')}
        </span>
      </div>
      <Button variant="glitch" size="sm" onClick={onContinue}>
        Go
      </Button>
    </div>
  );
}