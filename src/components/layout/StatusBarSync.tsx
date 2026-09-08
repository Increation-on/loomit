'use client';

import { useEffect } from 'react';

export function StatusBarSync() {
  useEffect(() => {
    const targetColor = '#121212';

    // 1. Контролируем мета-тег для Android / Samsung One UI
    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (meta) {
      meta.setAttribute('content', targetColor);
    } else {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = targetColor;
      document.head.appendChild(meta);
    }

    // 2. УДАЛЯЕМ инлайновый стиль, чтобы дать Tailwind v4 нормально дышать и менять цвета интерфейса
    document.documentElement.style.removeProperty('color-scheme');
  }, []);

  return null;
}
