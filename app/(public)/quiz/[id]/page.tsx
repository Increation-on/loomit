'use client';

import { usePathname } from 'next/navigation';
import { usePWA } from '@/hooks/usePWA';
import { QuizPlayer } from '@/components/features/QuizPlayer';
import { useEffect } from 'react';

export default function QuizPage() {
  const pathname = usePathname();
  const isPWA = usePWA();

  useEffect(() => {
    // Если это страница квиза и (PWA или мобильное устройство)
    if (pathname.startsWith('/quiz/') && isPWA) {
      document.body.classList.add('quiz-pwa-mode');
    } else {
      document.body.classList.remove('quiz-pwa-mode');
    }

    return () => {
      document.body.classList.remove('quiz-pwa-mode');
    };
  }, [pathname, isPWA]);

  return <QuizPlayer />;
}