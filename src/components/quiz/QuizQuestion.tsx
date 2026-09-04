// src/components/quiz/QuizQuestion.tsx

'use client';

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
  isSubmitting?: boolean; // ← добавить
}

const formatQuestionText = (text: string) => {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="font-mono bg-(--loom-white)/10 px-1.5 py-0.5 rounded text-(--loom-yellow) wrap-break-word"
        >
          {part.slice(1, -1)}
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
  isSubmitting = false, // ← добавить
}: QuizQuestionProps) {

  const isCurrentConfirmed = !!currentAnswer;

  const { fontSize, isReady, ref: questionRef } = useQuizFontSize({
    text: question.text,
    minFontSize: 14,
    maxFontSize: 24,
    step: 0.5,
    mode: 'dom',
    dependencies: [question.id],
  });

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
          <div className="h-30 flex items-center justify-center overflow-hidden -mt-4">
            <h2
              ref={questionRef}
              className="w-full font-bold text-(--loom-white) text-center"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: '1.3',
                maxHeight: '420px',
              }}
            >
              {formatQuestionText(question.text)}
            </h2>
          </div>

          <div className="flex flex-col gap-4 w-full mx-auto">
            {question.options.map((opt: any, idx: number) => {
              const isSelected = selectedOption === opt.id;
              const isCorrectOption =
                question.correctOptionId === opt.id;

              const isWrong =
                currentAnswer?.selectedOptionId === opt.id &&
                !currentAnswer?.isCorrect;

              let icon = null;

              if (isCurrentConfirmed) {
                if (isCorrectOption) {
                  icon = (
                    <Check
                      size={18}
                      className="text-(--loom-cyan) ml-auto"
                    />
                  );
                } else if (isWrong) {
                  icon = (
                    <X
                      size={18}
                      className="text-(--glitch-pink) ml-auto"
                    />
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

      <div className={cn(
        "bottom-1 left-0 right-0 bg-(--loom-black)/90 backdrop-blur-sm border-t border-(--loom-white)/10 flex justify-center z-50 py-4",
        isPWA ? "fixed" : "sticky"
      )}>
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