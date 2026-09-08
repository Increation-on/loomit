'use client';

import { useEffect } from 'react';

export function StatusBarSync() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const updateStatus = () => {
      // Проверяем строго наличие класса light. Если его нет — мы в дефолтном темном режиме
      const isLight = document.documentElement.classList.contains('light') || document.documentElement.getAttribute('data-theme') === 'light';
      const targetColor = isLight ? '#FFFFFF' : '#121212';

      let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
      if (meta) {
        meta.setAttribute('content', targetColor);
      } else {
        meta = document.createElement('meta');
        meta.name = 'theme-color';
        meta.content = targetColor;
        document.head.appendChild(meta);
      }

      // Принудительно прописываем инлайном системный color-scheme для Android Chromium,
      // чтобы системный текст (часы/батарея) не залипал при гидратации
      document.documentElement.style.colorScheme = isLight ? 'light' : 'dark';

      // Трюк с reflow
      const originalBg = document.body.style.backgroundColor;
      document.body.style.backgroundColor = targetColor;
      setTimeout(() => {
        document.body.style.backgroundColor = originalBg;
      }, 40);
    };


    // Запускаем проверку немедленно
    updateStatus();

    // На светлой теме при первой загрузке класс 'light' может прилететь чуть позже 
    // из провайдера тем, поэтому делаем повторный микро-вызов через 100мс для подстраховки
    const backupTimeout = setTimeout(updateStatus, 100);

    // Слежка за кнопкой переключения темы и сменой страниц
    const observer = new MutationObserver(() => {
      updateStatus();
    });

    observer.observe(html, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] });
    observer.observe(body, { attributes: true, attributeFilter: ['class', 'style'] });

    return () => {
      clearTimeout(backupTimeout);
      observer.disconnect();
    };
  }, []);

  return null;
}
