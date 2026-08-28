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
  // Хук считает размер один раз, ориентируясь на стабильную ширину контейнера
  const { fontSize, isReady, ref } = useQuizFontSize({
    text,
    minFontSize: 13,
    maxFontSize: 18,
    step: 0.5,
    dependencies: [isSelected, isCurrentConfirmed], // только для анимации рамки
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
        // Оставляем рамку 'border' (1px), чтобы она идеально совпадала с glitch-border
        'flex items-stretch rounded-xl border cursor-pointer transition-colors duration-200 w-full overflow-hidden',
        'bg-(--loom-white)/5',
        borderClass,
        className
      )}
      style={{ height: containerHeight }}
    >
      {/* Левая часть: Буква */}
      <div className="flex items-center justify-center px-4 py-2 border-r border-(--loom-white)/10 shrink-0">
        <span className={cn('text-lg font-bold', letterClass)}>{letter}</span>
      </div>

      {/* 
        Центральная часть: Измеряемый контейнер.
        Использование Flexbox гарантирует, что блок текста займет ВСЁ пространство, 
        кроме жестко зарезервированных 32px справа под иконку.
      */}
      <div
        ref={ref}
        className="flex-1 flex items-center justify-between px-4 py-2 min-h-0 overflow-hidden"
        style={{
          visibility: isReady ? 'visible' : 'hidden',
        }}
      >
        {/* Текст: его доступная ширина ВСЕГДА стабильна */}
        <span
          className={cn('min-w-0 flex-1 text-(--loom-white)/70', textClass)}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: '1.2',
            wordBreak: 'break-word',
            display: 'block',
          }}
        >
          {text}
        </span>

        {/* 
          Правая часть: ЗАЛИПШИЙ КАРМАН ДЛЯ ИКОНКИ.
          Он присутствует в DOM всегда, резервируя ровно 32px (w-8).
          Шрифт сразу подбирается с расчетом на то, что это место занято.
        */}
        <div className="w-1 h-1 flex items-center justify-center shrink-0 ml-2">
          <div 
            className="transition-opacity duration-200"
            style={{ 
              // Меняем видимость плавно или мгновенно без перестроения сетки
              opacity: icon ? 1 : 0, 
              visibility: icon ? 'visible' : 'hidden' 
            }}
          >
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
