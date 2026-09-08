'use client';

import { useEffect } from 'react';

export function StatusBarSync() {
  useEffect(() => {
    // Намертво фиксируем цвет статус-бара под фон твоего приложения (--loom-black)
    const targetColor = '#121212';

    // 1. Находим или создаем мета-тег строго один раз при загрузке
    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (meta) {
      meta.setAttribute('content', targetColor);
    } else {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = targetColor;
      document.head.appendChild(meta);
    }

    // 2. Говорим Android, что для системных элементов этот сайт ВСЕГДА темный.
    // Это заставит One UI держать часы и иконки БЕЛЫМИ, даже если само приложение светлое.
    document.documentElement.style.colorScheme = 'dark';
    
  }, []); // Массив зависимостей ПУСТОЙ. Никаких обсерверов. Сработало один раз и забыли.

  return null;
}
