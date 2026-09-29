'use client'

import { QuestionActions } from "./question/QuestionActions";
import { QuestionHint } from "./QuestionHint";


interface QuizFooterProps {
    isCurrentConfirmed: boolean;
    isLast: boolean;
    selectedOption: string | null;
    isSubmitting: boolean;
    isPWA?: boolean;
    explanation?: string;
    onConfirm: () => void;
    onNext: () => void;
    onFinish: () => void;
}

export function QuizFooter({
    isCurrentConfirmed,
    isLast,
    selectedOption,
    isSubmitting,
    isPWA,
    explanation,
    onConfirm,
    onNext,
    onFinish,
 }: QuizFooterProps) {
    return (
        <div className="relative">
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
            {isCurrentConfirmed && explanation && (
                <QuestionHint explanation={explanation} />
            )}
        </div>
    );
}