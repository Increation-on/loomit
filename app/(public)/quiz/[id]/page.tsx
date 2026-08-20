// app/(public)/quiz/[id]/page.tsx

'use client';

import { usePathname } from 'next/navigation';
import { usePWA } from '@/hooks/usePWA';
import { QuizPlayer } from '@/components/quiz/QuizPlayer';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetQuiz } from '@/store/slices/quizSlice';
import { Modal } from '@/components/ui/feedback/Modal';
import { cn } from '@/lib/utils';
import { useQuizReturn } from '@/hooks/useQuizReturn';
import { ChevronLeft } from 'lucide-react';

export default function QuizPage() {
  const pathname = usePathname();
  const isPWA = usePWA();
  const dispatch = useDispatch();
  const { goBack } = useQuizReturn('/catalog');
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    dispatch(resetQuiz());
  }, [dispatch]);

  useEffect(() => {
    if (pathname.startsWith('/quiz/') && isPWA) {
      document.body.classList.add('quiz-pwa-mode');
    } else {
      document.body.classList.remove('quiz-pwa-mode');
    }
    return () => document.body.classList.remove('quiz-pwa-mode');
  }, [pathname, isPWA]);

  const handleConfirmExit = () => {
    goBack();
    setShowExitModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col px-4 pb-safe pt-safe">
      {isPWA && (
        <button
          onClick={() => setShowExitModal(true)}
          className={cn(
            'fixed top-6 left-1 z-50 flex items-center gap-2',
            'text-(--loom-white)/60 hover:text-(--loom-white) transition-colors',
            'bg-(--loom-black)/60 backdrop-blur-sm px-3 py-2 rounded-full',
            'text-sm font-medium'
          )}
        >
          <ChevronLeft size={22} />
          Выйти
        </button>
      )}

      <div className="flex-1 flex flex-col justify-center w-full mx-auto mt-8">
        <QuizPlayer />
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