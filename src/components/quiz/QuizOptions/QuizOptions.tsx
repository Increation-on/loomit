'use client'

import { Check, X } from "lucide-react";
import { QuizOption } from "./QuizOption";

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
        <div className="flex flex-col gap-3 w-full mx-auto shrink-0 mt-2 mb-2">
            {options.map((opt: any, idx: number) => {
                const isSelected = selectedOption === opt.id;
                const isCorrectOption = correctOptionId === opt.id;
                const isWrong = currentAnswer?.selectedOptionId === opt.id && !currentAnswer?.isCorrect;

                let icon = null;
                if (isCurrentConfirmed) {
                    if (isCorrectOption) icon = <Check size={18} className="text-(--loom-cyan) ml-auto" />;
                    else if (isWrong) icon = <X size={18} className="text-(--glitch-pink) ml-auto" />;
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
    )
}