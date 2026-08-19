// src/hooks/useQuizReturn.ts

import { useRouter } from 'next/navigation';
import { useNavigationTransition } from '@/components/layout/NavigationProvider';

export function useQuizReturn(fallback: string = '/catalog') {
  const router = useRouter();
  const { quizOrigin, attemptReturnTo, clearQuizOrigin, clearAttemptReturnTo, startGlitchTransition } =
    useNavigationTransition();

  const goBack = () => {

     startGlitchTransition();

    if (attemptReturnTo) {
      router.push(attemptReturnTo);
      clearAttemptReturnTo();
    } else if (quizOrigin) {
      router.push(quizOrigin);
      clearQuizOrigin();
    } else {
      router.push(fallback);
    }
  };

  return { goBack };
}