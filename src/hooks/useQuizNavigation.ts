'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useQuizNavigation() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (redirecting) {
      router.push('/catalog');
    }
  }, [redirecting, router]);

  return { redirecting, setRedirecting };
}
