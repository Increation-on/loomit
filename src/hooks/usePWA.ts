'use client';

import { useEffect, useState } from 'react';

export function usePWA() {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsPWA(isStandalone);

    // Если PWA — отключаем контекстное меню на всех ссылках
    if (isStandalone) {
      const handleContextMenu = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('a')) {
          e.preventDefault();
        }
      };

      document.addEventListener('contextmenu', handleContextMenu);
      return () => document.removeEventListener('contextmenu', handleContextMenu);
    }
  }, []);

  return isPWA;
}