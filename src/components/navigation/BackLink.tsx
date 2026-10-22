'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigationTransition } from '../layout/NavigationProvider';


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
  
  const { 
    quizOrigin, 
    attemptReturnTo, 
    clearQuizOrigin, 
    clearAttemptReturnTo, 
    startGlitchTransition 
  } = useNavigationTransition();

  const handleBack = () => {
    startGlitchTransition();

    // 1. Умный возврат для квизов
    if (attemptReturnTo) {
      router.push(attemptReturnTo);
      clearAttemptReturnTo();
    } else if (quizOrigin) {
      router.push(quizOrigin);
      clearQuizOrigin();
    } else {
      // 2. Проверяем, есть ли внутренняя история Next.js (idx > 0)
      const hasInternalHistory = typeof window !== 'undefined' && window.history.state?.idx > 0;
      
      if (hasInternalHistory) {
        router.back();
      } else {
        router.push(fallback || '/');
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
