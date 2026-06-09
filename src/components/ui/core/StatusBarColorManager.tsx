'use client';

import { useTheme } from '@/hooks/useTheme';
import { useEffect } from 'react';

export function StatusBarColorManager() {
  const { theme } = useTheme();

  useEffect(() => {
    const updateMeta = () => {
      let meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'theme-color');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', theme === 'dark' ? '#000000' : '#FFFFFF');
    };

    // Обновляем при монтировании
    updateMeta();

    // Обновляем при смене темы
    // Обновляем при клиентской навигации (переходе между страницами)
    window.addEventListener('popstate', updateMeta);

    return () => {
      window.removeEventListener('popstate', updateMeta);
    };
  }, [theme]);

  return null;
}