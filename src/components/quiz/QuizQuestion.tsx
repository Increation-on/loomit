'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { prepareQuestionContent } from '@/lib/utils/quiz';
import { QuestionActions } from './question/QuestionActions';
import { QuestionCodeBlock } from './question/QuestionCodeBlock';
import { QuestionOptions } from './question/QuestionOptions';
import { QuestionText } from './question/QuestionText';

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

  const { inlineText, blockCode, textForSizing } = useMemo(
    () => prepareQuestionContent(question.text),
    [question.text]
  );

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
          {/* 🔑 КОНТЕЙНЕР:  */}
          <div className={cn(
            "w-full flex flex-col justify-center items-center -mt-4 mb-4 gap-2 box-border py-1",
            blockCode
              ? "h-56 max-h-56 overflow-hidden"    // ← с кодом: 224px, код скроллится внутри
              : "h-36 max-h-36 overflow-hidden"    // ← без кода: 144px, как было
          )}>

            {/* ТЕКСТ ВОПРОСА */}
            <QuestionText
              textForSizing={textForSizing}
              blockCode={blockCode}
              questionId={question.id}
              inlineText={inlineText}
            />
            {/* МНОГОСТРОЧНЫЙ БЛОК КОДА */}
            {blockCode && <QuestionCodeBlock code={blockCode} />}
          </div>

          {/* ВАРИАНТЫ ОТВЕТОВ */}
          <QuestionOptions
            options={question.options}
            correctOptionId={question.correctOptionId}
            selectedOption={selectedOption}
            currentAnswer={currentAnswer}
            isCurrentConfirmed={isCurrentConfirmed}
            isSubmitting={isSubmitting}
            optionLetters={optionLetters}
            onSelectOption={onSelectOption}
          />

        </motion.div>
      </AnimatePresence>

      {/* КНОПКИ ДЕЙСТВИЯ */}
      <QuestionActions
        isCurrentConfirmed={isCurrentConfirmed}
        isLast={isLast}
        selectedOption={selectedOption}
        isSubmitting={isSubmitting}
        isPWA={isPWA}
        onConfirm={onConfirm}
        onNext={onNext}
        onFinish={onFinish}
      />
    </div>
  );
}
