'use client';

import { useEffect } from 'react';

export function StatusBarSync() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const updateStatus = () => {
      // 1. Проверяем, содержит ли html класс 'light'
      const isLight = html.classList.contains('light') || html.getAttribute('data-theme') === 'light';
      
      // На светлой теме красим в белый #FFFFFF, на темной — в твой #121212 (--loom-black)
      const targetColor = isLight ? '#FFFFFF' : '#121212';

      // 2. Синхронизируем мета-тег theme-color
      let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
      if (meta) {
        meta.setAttribute('content', targetColor);
      } else {
        meta = document.createElement('meta');
        meta.name = 'theme-color';
        meta.content = targetColor;
        document.head.appendChild(meta);
      }

      // 3. Явно диктуем браузеру системную схему, чтобы инвертировать иконки (часы/батарею)
      html.style.colorScheme = isLight ? 'light' : 'dark';

      // 4. СУПЕР FORCE-REFLOW ХАК ДЛЯ SAMSUNG ONE UI:
      // Временно меняем backgroundColor и добавляем микро-трансформацию.
      // Это заставляет композитор слоев Android проснуться и перерисовать статус-бар целиком.
      const originalBg = body.style.backgroundColor;
      const originalTransform = body.style.transform;

      body.style.backgroundColor = targetColor;
      body.style.transform = 'translateZ(0)'; // Включает аппаратное ускорение рендера GPU

      setTimeout(() => {
        body.style.backgroundColor = originalBg;
        body.style.transform = originalTransform;
      }, 40);
    };

    // Первичный вызов при монтировании
    updateStatus();

    // Страховочный вызов через 150мс, чтобы поймать ленивую инициализацию useTheme на клиенте
    const hydrationTimeout = setTimeout(updateStatus, 150);

    // Слушаем клики по кнопке смены темы
    const observer = new MutationObserver(() => {
      updateStatus();
    });

    observer.observe(html, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    return () => {
      clearTimeout(hydrationTimeout);
      observer.disconnect();
    };
  }, []);

  return null;
}
