'use client';

import { useEffect, useState } from 'react';

export function usePWA() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const check = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isMobile = window.innerWidth < 768;

      const isDevMobile = process.env.NODE_ENV === 'development' && isMobile;

      setIsHidden(isStandalone || isDevMobile);
    };

    check();

    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isHidden;
}