'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigationTransition } from '@/components/layout/NavigationProvider';

interface BackLinkProps {
  fallback?: string;
  className?: string;
  label?: string;
  iconSize?: number;
  children?: React.ReactNode;
}

export function BackLink({
  fallback = '/catalog',
  className,
  label = 'Назад',
  iconSize = 22,
  children,
}: BackLinkProps) {
  const router = useRouter();
  
  // Достаем контекст квиза напрямую из провайдера
  const { 
    quizOrigin, 
    attemptReturnTo, 
    clearQuizOrigin, 
    clearAttemptReturnTo, 
    startGlitchTransition 
  } = useNavigationTransition();

  const handleBack = () => {
    startGlitchTransition();

    // 1. Если мы в контексте квиза (умный возврат)
    if (attemptReturnTo) {
      router.push(attemptReturnTo);
      clearAttemptReturnTo();
    } else if (quizOrigin) {
      router.push(quizOrigin);
      clearQuizOrigin();
    } else {
      // 2. Обычный возврат для всех остальных страниц
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push(fallback);
      }
    }
  };

  return (
    <button
      onClick={handleBack}
      className={cn(
        'inline-flex items-center gap-2 text-(--loom-white)/60 transition-colors hover:text-(--loom-white) active:scale-[0.98]',
        className
      )}
    >
      <ChevronLeft size={iconSize} />
      {children || label}
    </button>
  );
}
