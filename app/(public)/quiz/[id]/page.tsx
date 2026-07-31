'use client';

import { usePathname, useRouter } from 'next/navigation';
import { usePWA } from '@/hooks/usePWA';
import { QuizPlayer } from '@/components/features/QuizPlayer';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function QuizPage() {
  const pathname = usePathname();
  const router = useRouter();
  const isPWA = usePWA();

  useEffect(() => {
    // Скрываем навигацию ТОЛЬКО в режиме PWA на странице квиза
    if (pathname.startsWith('/quiz/') && isPWA) {
      document.body.classList.add('quiz-pwa-mode');
    } else {
      document.body.classList.remove('quiz-pwa-mode');
    }

    return () => {
      document.body.classList.remove('quiz-pwa-mode');
    };
  }, [pathname, isPWA]);

  return (
    <>
      {/* Кнопка «Назад» — только в PWA */}
      {isPWA && (
        <button
          onClick={() => router.back()}
          className={cn(
            'fixed top-6 left-4 z-50 flex items-center gap-2',
            'text-(--loom-white)/60 hover:text-(--loom-white) transition-colors',
            'bg-(--loom-black)/60 backdrop-blur-sm px-3 py-2 rounded-full',
            'text-sm font-medium'
          )}
        >
          <ArrowLeft size={18} />
          Назад
        </button>
      )}

      <QuizPlayer />
    </>
  );
}