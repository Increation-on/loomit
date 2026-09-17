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
  if (code.includes('\n')) return code;

  if (code.includes(';')) {
    const parts = code.split(';').map((s) => s.trim()).filter(Boolean);
    return parts
      .map((s, i) => (i < parts.length - 1 ? s + ';' : s))
      .join('\n');
  }

  return code;
};

const formatQuestionText = (text: string, fontSize: number) => {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const rawCode = part.slice(1, -1);
      const code = formatCode(rawCode);
      const isMultiline = code.includes('\n');

      if (isMultiline) {
        return (
          <pre
            key={i}
            style={{ fontSize: `${Math.max(fontSize * 0.65, 13)}px` }}
            className="font-mono bg-(--loom-white)/10 px-3 py-2 rounded-lg text-(--loom-yellow) my-2 w-full text-left whitespace-pre-wrap break-all leading-snug"
          >
            <code>{code}</code>
          </pre>
        );
      }

      return (
        <code
          key={i}
          className="font-mono bg-(--loom-white)/10 px-1.5 py-0.5 rounded text-(--loom-yellow) whitespace-nowrap"
        >
          {code}
        </code>
      );
    }
    return part;
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

  // 🔑 Мемоизируем текст без кода для подсчёта размера шрифта
  const textForSizing = useMemo(
    () => question.text.replace(/`[^`]+`/g, ''),
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
          <div className="h-36 flex items-center justify-center overflow-hidden -mt-4 mb-4">
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