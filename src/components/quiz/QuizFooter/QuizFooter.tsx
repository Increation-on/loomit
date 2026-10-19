'use client';

import { QuizActions } from './QuizActions';
import { QuizHint } from './QuizHint';

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
    <div className="relative w-full border-t border-(--loom-white)/10 bg-(--loom-black)/90">
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
        <div className="pointer-events-none absolute inset-y-0 top-2 right-0 flex items-center">
          <div className="pointer-events-auto">
            <QuizHint explanation={explanation} />
          </div>
        </div>
      )}
    </div>
  );
}
