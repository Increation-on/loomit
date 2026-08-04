'use client';

import { usePathname, useRouter } from 'next/navigation';
import { usePWA } from '@/hooks/usePWA';
import { QuizPlayer } from '@/components/features/QuizPlayer';
import { useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDispatch } from 'react-redux';
import { resetQuiz } from '@/store/slices/quizSlice';

export default function QuizPage() {
  const pathname = usePathname();
  const router = useRouter();
  const isPWA = usePWA();
  const dispatch = useDispatch();

  // ✅ Сбрасываем квиз при каждом заходе на страницу
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

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col px-4 pb-safe pt-safe">
      {isPWA && (
        <button
          onClick={handleBack}
          className={cn(
            'fixed top-6 left-1 z-50 flex items-center gap-2',
            'text-(--loom-white)/60 hover:text-(--loom-white) transition-colors',
            'bg-(--loom-black)/60 backdrop-blur-sm px-3 py-2 rounded-full',
            'text-sm font-medium'
          )}
        >
          <ChevronLeft size={22} />
          На главную
        </button>
      )}

      <div className="flex-1 flex flex-col justify-center w-full mx-auto mt-8">
        <QuizPlayer />
      </div>
    </div>
  );
}