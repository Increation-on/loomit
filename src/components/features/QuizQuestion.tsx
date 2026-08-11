// src\components\features\QuizQuestion.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/core/Button';
import { QuizOption } from './QuizOption';
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

  questionFontSize: number;
  optionFontSizes: number[];
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
  optionLetters,
  questionFontSize,
  optionFontSizes
}: QuizQuestionProps) {

  const isCurrentConfirmed = !!currentAnswer;
  

  const availableHeight = 420;

  return (
    <div className="flex flex-col h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4 border-amber-500"
        >
          <div
            className="h-28 flex items-center justify-center overflow-hidden"
          >
            <h2
              className="w-full font-bold text-(--loom-white) text-center border-amber-400"
              style={{
                fontSize: `${questionFontSize}px`,
                lineHeight: '1.3',
                maxHeight: `${availableHeight}px`,
              }}
            >
              {question.text}
            </h2>
          </div>

          <div className="flex flex-col gap-3 w-full mx-auto">
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
                  fontSize={optionFontSizes[idx]}
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
        </motion.div>
      </AnimatePresence>

      <div className="mt-auto sticky bottom-0 bg-(--loom-black)/90 backdrop-blur-sm border-t border-(--loom-white)/10 flex justify-center z-50 py-4">
        {!isCurrentConfirmed ? (
          <Button
            variant="glitch"
            onClick={onConfirm}
            disabled={!selectedOption}
            className="px-12 py-2.5 text-base min-w-40"
          >
            Ответить
          </Button>
        ) : isLast ? (
          <Button
            variant="glitch"
            onClick={onFinish}
            className="px-12 py-2.5 text-base min-w-40"
          >
            Завершить
          </Button>
        ) : (
          <Button
            variant="glitch"
            onClick={onNext}
            className="px-12 py-2.5 text-base min-w-40"
          >
            Далее
          </Button>
        )}
      </div>
    </div>
  );
}