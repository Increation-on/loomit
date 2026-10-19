'use client';

import { Check, X } from 'lucide-react';
import { QuizOption } from './QuizOption';

interface QuizOptionsProps {
  options: { id: string; text: string }[];
  correctOptionId: string;
  selectedOption: string | null;
  currentAnswer?: { selectedOptionId: string; isCorrect: boolean } | null;
  isCurrentConfirmed: boolean;
  isSubmitting?: boolean;
  optionLetters: string[];
  onSelectOption: (optionId: string) => void;
}

export function QuizOptions({
  options,
  correctOptionId,
  selectedOption,
  currentAnswer,
  isCurrentConfirmed,
  isSubmitting = false,
  optionLetters,
  onSelectOption,
}: QuizOptionsProps) {
  return (
    <div className="mx-auto mt-2 mb-2 flex w-full shrink-0 flex-col gap-3">
      {options.map((opt: any, idx: number) => {
        const isSelected = selectedOption === opt.id;
        const isCorrectOption = correctOptionId === opt.id;
        const isWrong = currentAnswer?.selectedOptionId === opt.id && !currentAnswer?.isCorrect;

        let icon = null;
        if (isCurrentConfirmed) {
          if (isCorrectOption) icon = <Check size={18} className="ml-auto text-(--loom-cyan)" />;
          else if (isWrong) icon = <X size={18} className="ml-auto text-(--glitch-pink)" />;
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
  );
}
