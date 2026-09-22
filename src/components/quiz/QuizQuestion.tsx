// src/components/quiz/QuizQuestion.tsx

'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/core/Button';
import { QuizOption } from './QuizOption';
import { Check, X } from 'lucide-react';
import { useQuizFontSize } from '@/hooks/useQuizFontSize';
import { cn } from '@/lib/utils';

interface QuizQuestionProps {
  question: {
    id: string;
    text: string;
    options: any[];
    correctOptionId: string;
    explanation?: string;
  };

  currentAnswer?: {
    selectedOptionId: string;
    isCorrect: boolean;
  } | null;

  selectedOption: string | null;

  onSelectOption: (optionId: string) => void;
  onConfirm: () => void;
  onNext: () => void;
  onFinish: () => void;

  isLast: boolean;
  currentIndex: number;
  total: number;

  optionLetters: string[];
  isPWA?: boolean;
  isSubmitting?: boolean;
}

// Разбивает однострочный код на строки по ;
const formatCode = (code: string) => {
  if (!code) return '';
  if (code.includes('\n')) return code.trim();

  // Если код короткий (например, просто `typeof null` или `a === b`), не трогаем его
  if (code.length < 30 && !code.includes(';')) return code.trim();

  // Универсальный разбор строки на логические переносы
  let formatted = code
    // Расставляем переносы строк вокруг фигурных скобок
    .replace(/\{\s*/g, '{\n  ')
    .replace(/\s*\}/g, '\n}')
    // Переносим строки после точек с запятой, но ИГНОРИРУЕМ их внутри круглых скобок (для циклов for)
    .replace(/;(?![^(]*\))/g, ';\n  ')
    // Чистим случайные дубликаты пустых строк
    .replace(/\n\s*\n/g, '\n');

  // Выравниваем закрывающую скобку, если перед ней остались лишние пробелы отступов
  formatted = formatted.replace(/\n\s*\}/g, '\n}');

  return formatted.trim();
};






const formatQuestionText = (text: string, fontSize: number) => {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const rawCode = part.slice(1, -1);
      const code = formatCode(rawCode);
      
      // Если в коде есть переносы ИЛИ он сам по себе слишком длинный для инлайна
      const isBlock = code.includes('\n') || code.length > 35;

      if (isBlock) {
        return (
          <pre
            key={i}
            // Динамический размер с безопасным коэффициентом
            style={{ fontSize: `${Math.max(fontSize * 0.7, 13)}px` }}
            // whitespace-pre-wrap + break-words: если строка кода шире экрана, 
            // она перенесется по пробелу (например после =>), а не вылетит за экран
            className="font-mono bg-(--loom-white)/10 px-4 py-3 rounded-lg text-(--loom-yellow) my-3 w-full text-left whitespace-pre-wrap break-words leading-relaxed box-border border border-(--loom-white)/5"
          >
            <code>{code}</code>
          </pre>
        );
      }

      // Настоящий короткий инлайн-код (например, `typeof null`)
      return (
        <code
          key={i}
          style={{ fontSize: `${Math.max(fontSize * 0.9, 14)}px` }}
          // inline-block и break-words застрахуют от вылетов на мизерных экранах
          className="font-mono bg-(--loom-white)/10 px-1.5 py-0.5 rounded text-(--loom-yellow) inline-block max-w-full whitespace-normal break-words align-middle mx-0.5"
        >
          {code}
        </code>
      );
    }
    return <span key={i} className="align-middle">{part}</span>;
  });
};



export function QuizQuestion({
  question,
  currentAnswer,
  selectedOption,
  onSelectOption,
  onConfirm,
  onNext,
  onFinish,
  isLast,
  optionLetters,
  isPWA = false,
  isSubmitting = false,
}: QuizQuestionProps) {
  const isCurrentConfirmed = !!currentAnswer;

const textForSizing = useMemo(
  // Каждая кавычка имитирует дополнительное визуальное пространство кода
  () => question.text.replace(/`/g, '      '),
  [question.text]
);






  const { fontSize, ref: questionRef } = useQuizFontSize({
    text: textForSizing,
    minFontSize: 16,
    maxFontSize: 24,
    step: 0.5,
    mode: 'dom',
    dependencies: [question.id],
  });

  const alignClass =
    question.text.length > 70 || question.text.includes('`')
      ? 'text-left'
      : 'text-center';

  return (
    <div className="flex flex-col h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <div className="h-36 flex items-center justify-center overflow-y-auto scrollbar-thin -mt-4 mb-4 pr-1">
            <h2
              ref={questionRef}
              className={cn(
                'w-full font-bold text-(--loom-white)',
                alignClass
              )}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: '1.3',
                maxHeight: '420px',
              }}
            >
              {formatQuestionText(question.text, fontSize)}
            </h2>
          </div>

          <div className="flex flex-col gap-3 w-full mx-auto">
            {question.options.map((opt: any, idx: number) => {
              const isSelected = selectedOption === opt.id;
              const isCorrectOption = question.correctOptionId === opt.id;

              const isWrong =
                currentAnswer?.selectedOptionId === opt.id &&
                !currentAnswer?.isCorrect;

              let icon = null;

              if (isCurrentConfirmed) {
                if (isCorrectOption) {
                  icon = (
                    <Check size={18} className="text-(--loom-cyan) ml-auto" />
                  );
                } else if (isWrong) {
                  icon = (
                    <X size={18} className="text-(--glitch-pink) ml-auto" />
                  );
                }
              }

              return (
                <QuizOption
                  key={idx}
                  letter={optionLetters[idx]}
                  text={opt.text}
                  isSelected={isSelected}
                  isCurrentConfirmed={isCurrentConfirmed}
                  isCorrect={isCorrectOption}
                  isWrong={isWrong}
                  icon={icon}
                  onClick={() => {
                    if (!isCurrentConfirmed && !isSubmitting) {
                      onSelectOption(opt.id);
                    }
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div
        className={cn(
          'bottom-1 left-0 right-0 bg-(--loom-black)/90 backdrop-blur-sm border-t border-(--loom-white)/10 flex justify-center z-50 py-4',
          isPWA ? 'fixed' : 'sticky'
        )}
      >
        {!isCurrentConfirmed ? (
          <Button
            variant="glitch"
            onClick={onConfirm}
            disabled={!selectedOption || isSubmitting}
            className="px-12 py-2.5 text-base min-w-40"
          >
            {isSubmitting ? 'Ждем...' : 'Ответить'}
          </Button>
        ) : isLast ? (
          <Button
            variant="glitch"
            onClick={onFinish}
            disabled={isSubmitting}
            className="px-12 py-2.5 text-base min-w-40"
          >
            Завершить
          </Button>
        ) : (
          <Button
            variant="glitch"
            onClick={onNext}
            disabled={isSubmitting}
            className="px-12 py-2.5 text-base min-w-40"
          >
            Далее
          </Button>
        )}
      </div>
    </div>
  );
}