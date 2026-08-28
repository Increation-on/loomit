'use client';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

  const levelLabel = quiz.level
    ? quiz.level.charAt(0) + quiz.level.slice(1).toLowerCase()
    : '';

  return (
    <div
      onClick={onClick}
      className={cn(
        'w-50 h-46 shrink-0 snap-start bg-(--loom-cyan)/20 p-4 rounded-xl cursor-pointer relative transition-all duration-300 try-it-card flex flex-col',
        (isActive || isClicked) && 'snake-active'
      )}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {quiz.category?.iconUrl ? (
            <img
              src={quiz.category.iconUrl}
              alt=""
              className="w-9 h-9 rounded-full object-contain"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-(--loom-cyan)/20 flex items-center justify-center text-(--loom-cyan) text-l font-bold">
              {quiz.category?.name?.[0] || '?'}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          
          <div className="min-h-5 min-w-10 flex items-center justify-center">
            {lastAttempt ? (
              <span
                className={cn(
                  'text-xs font-semibold',
                  lastAttempt.score === lastAttempt.totalQuestions &&
                    'text-(--loom-cyan)',
                  lastAttempt.score < lastAttempt.totalQuestions &&
                    'text-(--loom-yellow)'
                )}
              >
                {lastAttempt.score}/{lastAttempt.totalQuestions}
              </span>
            ) : (
              <div className="h-4 w-10 bg-(--loom-white)/5 rounded animate-pulse" />
            )}
          </div>
          <span className="text-(--loom-white)/30">•</span>
          {quiz.level && (
            <span className={cn('text-xs font-semibold', levelColor)}>
              {levelLabel}
            </span>
          )}
        </div>
      </div>
      <h3 className="font-bold text-lg text-(--loom-white) truncate leading-tight mt-1">
        {quiz.title}
      </h3>
      <p className="flex-1 text-sm text-(--loom-white)/60 mt-1 line-clamp-4">
        {quiz.description}
      </p>
    </div>
  );
}
