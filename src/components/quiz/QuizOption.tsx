// src/components/quiz/QuizOption.tsx

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useQuizFontSize } from '@/hooks/useQuizFontSize';

interface QuizOptionProps {
  letter: string;
  text: string;
  isSelected: boolean;
  isCurrentConfirmed: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
  containerHeight?: number;
}

export function QuizOption({
  letter,
  text,
  isSelected,
  isCurrentConfirmed,
  isCorrect,
  isWrong,
  icon,
  onClick,
  className,
  containerHeight = 62,
}: QuizOptionProps) {
  const { fontSize, ref } = useQuizFontSize({
    text,
    minFontSize: 13,
    maxFontSize: 18,
    step: 0.5,
  });

  let borderClass = 'border-(--loom-white)/10 hover:border-(--loom-cyan)/40';
  let letterClass =
    'font-bold bg-gradient-to-r from-(--loom-yellow) to-(--loom-cyan) bg-clip-text text-transparent';
  let textClass = 'text-(--loom-white)/70';

  if (isSelected && !isCurrentConfirmed) {
    borderClass = 'glitch-border';
    letterClass = 'text-(--loom-yellow) font-bold';
    textClass = 'text-(--loom-yellow)';
  }

  if (isCurrentConfirmed) {
    if (isCorrect) {
      borderClass = 'border-(--loom-cyan)';
      letterClass = 'text-(--loom-cyan) font-bold';
      textClass = 'text-(--loom-cyan)';
    } else if (isWrong) {
      borderClass = 'border-(--glitch-pink)';
      letterClass = 'text-(--glitch-pink) font-bold';
      textClass = 'text-(--glitch-pink)/80';
    }
  }

  return (
    <motion.div
      whileHover={!isCurrentConfirmed ? { scale: 1.01 } : {}}
      whileTap={!isCurrentConfirmed ? { scale: 0.98 } : {}}
      onClick={onClick}
      role="button"
      aria-label={`Вариант ${letter}`}
      className={cn(
        'flex items-stretch rounded-xl border-2 cursor-pointer transition-colors duration-200 w-full overflow-hidden',
        'bg-(--loom-white)/5',
        borderClass,
        className
      )}
      style={{ height: containerHeight }}
    >
      <div className="flex items-center justify-center px-4 py-2 border-r border-(--loom-white)/10 shrink-0">
        <span className={cn('text-lg font-bold', letterClass)}>{letter}</span>
      </div>

      <div
        ref={ref}
        className="relative flex-1 flex items-center px-4 py-2 min-h-0 overflow-hidden"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: '1.2',
          wordBreak: 'break-word',
        }}
      >
        <span
          className={cn('text-(--loom-white)/70', textClass)}
          style={{
            fontSize: 'inherit',
            display: 'block',
            width: '100%',
          }}
        >
          {text}
        </span>

        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}