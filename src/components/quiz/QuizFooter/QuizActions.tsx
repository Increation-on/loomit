'use client'

import { Button } from '@/components/ui/core/Button';

interface QuizActionsProps {
    isCurrentConfirmed: boolean;
    isLast: boolean;
    selectedOption: string | null;
    isSubmitting: boolean;
    onConfirm: () => void;
    onNext: () => void;
    onFinish: () => void;
}


export function QuizActions({
    isCurrentConfirmed,
    isLast,
    selectedOption,
    isSubmitting,
    onConfirm,
    onNext,
    onFinish,
}: QuizActionsProps) {
    return (
        <div className='flex justify-center py-4'>
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
    )
}