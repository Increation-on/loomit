'use client';

import { useEffect } from 'react';

export function StatusBarSync() {
  useEffect(() => {
    const targetColor = '#121212';

    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (meta) {
      meta.setAttribute('content', targetColor);
    } else {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = targetColor;
      document.head.appendChild(meta);
    }

    // Сообщаем системе, что статус-бар ВСЕГДА темный (буквы часов будут белыми)
    document.documentElement.style.colorScheme = 'dark';
  }, []);

  return null;
}
