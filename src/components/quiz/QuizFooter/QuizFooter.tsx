'use client'

import { QuizActions } from "./QuizActions";
import { QuizHint } from "./QuizHint";



interface QuizFooterProps {
    isCurrentConfirmed: boolean;
    isLast: boolean;
    selectedOption: string | null;
    isSubmitting: boolean;
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
    explanation,
    onConfirm,
    onNext,
    onFinish,
}: QuizFooterProps) {
    return (
        <div className='relative border-t border-(--loom-white)/10 bg-(--loom-black)/90 backdrop-blur-sm w-full'>
            <QuizActions
                isCurrentConfirmed={isCurrentConfirmed}
                isLast={isLast}
                selectedOption={selectedOption}
                isSubmitting={isSubmitting}
                onConfirm={onConfirm}
                onNext={onNext}
                onFinish={onFinish}
            />
            {isCurrentConfirmed && explanation && (
                <div className="absolute right-2 top-11 -translate-y-1/2">
                    <QuizHint explanation={explanation} />
                </div>
            )}
        </div>
    );
}