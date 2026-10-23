'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { GlitchLine } from '@/components/common/GlitchLine';
import { useNavigationTransition } from '../../NavigationProvider';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

export default function PWAHeader({ title, showBack = false }: PageHeaderProps) {
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
    
    if (attemptReturnTo) {
      router.push(attemptReturnTo);
      clearAttemptReturnTo();
    } else if (quizOrigin) {
      router.push(quizOrigin);
      clearQuizOrigin();
    } else {
      // Проверяем, есть ли внутренняя история Next.js
      const hasInternalHistory = typeof window !== 'undefined' && window.history.state?.idx > 0;
      
      if (hasInternalHistory) {
        router.back();
      } else {
        router.push('/');
      }
    }
  };

  return (
    <header
      className="sticky top-0 z-50 flex h-12 w-full items-center px-4 backdrop-blur-sm"
      style={{ backgroundColor: 'var(--nav-bg)' }}
    >
      <div className="flex w-10 shrink-0 items-center justify-start">
        {showBack && (
          <button
            onClick={handleBack}
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
            aria-label="Назад"
          >
            <ChevronLeft className="h-6 w-6 text-(--loom-white)" />
          </button>
        )}
      </div>

      <div className="flex-1 text-center">
        <h1 className="truncate text-base font-semibold text-(--loom-white)">{title}</h1>
      </div>

      <div className="w-10 shrink-0" />
      
      <GlitchLine />
    </header>
  );
}
