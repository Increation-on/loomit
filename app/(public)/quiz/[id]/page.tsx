// app/(public)/quiz/[id]/page.tsx

'use client';

import { useParams, usePathname } from 'next/navigation';
import { usePWA } from '@/hooks/usePWA';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetQuiz } from '@/store/slices/quizSlice';
import { Modal } from '@/components/ui/feedback/Modal';
import { cn } from '@/lib/utils';
import { useQuizReturn } from '@/hooks/useQuizReturn';
import { ChevronLeft } from 'lucide-react';
import { QuizContent } from '@/components/quiz/QuizContent';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function QuizPage() {
  const pathname = usePathname();
  const isPWA = usePWA();
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const { goBack } = useQuizReturn('/catalog');
  const [showExitModal, setShowExitModal] = useState(false);
  const { id } = useParams();

  const shouldHideLayout = isPWA || isMobile;

  const handleConfirmExit = () => {
    goBack();
    setShowExitModal(false);
  };

  useEffect(() => {
    dispatch(resetQuiz());
  }, [dispatch]);

  useEffect(() => {
    if (pathname.startsWith('/quiz/') && shouldHideLayout) {
      document.body.classList.add('quiz-hide-layout');
    } else {
      document.body.classList.remove('quiz-hide-layout');
    }
    return () => document.body.classList.remove('quiz-hide-layout');
  }, [pathname, shouldHideLayout]);

  return (
    <div className="pb-safe pt-safe flex min-h-screen flex-col px-4">
      {shouldHideLayout && (
        <button
          onClick={() => setShowExitModal(true)}
          className={cn(
            'fixed top-[calc(env(safe-area-inset-top)+0.5rem)] left-1 z-50 flex items-center gap-2',
            'text-(--loom-white)/60 transition-colors hover:text-(--loom-white)',
            'rounded-full bg-(--loom-black)/60 px-3 py-2 backdrop-blur-sm',
            'text-sm font-medium'
          )}
        >
          <ChevronLeft size={22} />
          Выйти
        </button>
      )}

      <div className="mx-auto flex w-full flex-1 flex-col justify-center">
        <QuizContent id={id as string} />
      </div>

      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onCancel={() => setShowExitModal(false)}
        onConfirm={handleConfirmExit}
        title="Выйти из квиза?"
        confirmText="Выйти"
        cancelText="Остаться"
      >
        <p>Вы действительно хотите Выйти?</p>
      </Modal>
    </div>
  );
}
