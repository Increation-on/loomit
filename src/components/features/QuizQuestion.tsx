'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/core/Button';
import { QuizOption } from './QuizOption';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

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
}

export function QuizQuestion({
  question,
  currentAnswer,
  selectedOption,
  onSelectOption,
  onConfirm,
  onNext,
  onFinish,
  isLast,
  currentIndex,
  total,
  optionLetters,
}: QuizQuestionProps) {
  const isCurrentConfirmed = !!currentAnswer;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.25 }}
        className="w-full space-y-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-(--loom-white) leading-tight">
          {question.text}
        </h2>

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
                icon = <Check size={18} className="text-(--loom-cyan) ml-auto" />;
              } else if (isWrong) {
                icon = <X size={18} className="text-(--glitch-pink) ml-auto" />;
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
                  if (!isCurrentConfirmed) {
                    onSelectOption(opt.id);
                  }
                }}
              />
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-2 pt-8">
          {!isCurrentConfirmed ? (
            <Button
              variant="glitch"
              onClick={onConfirm}
              disabled={!selectedOption}
              className="px-12 py-2.5 text-base"
            >
              Ответить
            </Button>
          ) : isLast ? (
            <Button
              variant="glitch"
              onClick={onFinish}
              className="px-12 py-2.5 text-base"
            >
              Завершить
            </Button>
          ) : (
            <Button
              variant="glitch"
              onClick={onNext}
              className="px-12 py-2.5 text-base"
            >
              Далее
            </Button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}