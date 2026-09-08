'use client';

import { useEffect } from 'react';

export function StatusBarSync() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const updateStatus = () => {
      // Проверяем, активна ли светлая тема. Если нет — по умолчанию считаем её тёмной
      const isLight = html.classList.contains('light') || html.getAttribute('data-theme') === 'light';
      
      // Идеальное совпадение: #FFFFFF для светлой и строго #121212 (--loom-black) для тёмной
      const targetColor = isLight ? '#FFFFFF' : '#121212';

      const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;

      if (meta) {
        meta.setAttribute('content', targetColor);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'theme-color';
        newMeta.content = targetColor;
        document.head.appendChild(newMeta);
      }

      // Наш force-reflow хак для Android, но теперь строго с цветом #121212
      const originalBg = body.style.backgroundColor;
      body.style.backgroundColor = targetColor;
      
      setTimeout(() => {
        body.style.backgroundColor = originalBg;
      }, 30);
    };

    // Первая отработка при гидратации
    updateStatus();

    // Наблюдатель за кликами по кнопке смены темы
    const observer = new MutationObserver(() => {
      updateStatus();
    });

    observer.observe(html, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    observer.observe(body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return null;
}
