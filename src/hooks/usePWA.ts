'use client';

import { useEffect, useState } from 'react';

export function usePWA() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const check = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      
      // ✅ Проверяем мобильность через userAgent (без ложных срабатываний)
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      
      // ✅ Включаем отладку только на реальных мобильных устройствах
      const isDevMobile = process.env.NODE_ENV === 'development' && isMobile;

      setIsHidden(isStandalone || isDevMobile);
    };

    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isHidden;
}
