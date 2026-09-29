'use client'

import { Button } from '@/components/ui/core/Button';
import { cn } from '@/lib/utils';

interface QuestionActionsProps {
    isCurrentConfirmed: boolean;
    isLast: boolean;
    selectedOption: string | null;
    isSubmitting: boolean;
    isPWA?: boolean;
    onConfirm: () => void;
    onNext: () => void;
    onFinish: () => void;
}


export function QuestionActions({
    isCurrentConfirmed,
    isLast,
    selectedOption,
    isSubmitting,
    isPWA = false,
    onConfirm,
    onNext,
    onFinish,
}: QuestionActionsProps) {
    return (
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
    )
}