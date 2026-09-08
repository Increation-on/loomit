'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function StatusBarSync() {
  const pathname = usePathname(); // Следим за изменением роута в Next.js

  useEffect(() => {
    const targetColor = '#121212';

    const enforceColor = () => {
      // Ищем абсолютно ВСЕ мета-теги theme-color (Next.js может плодить дубликаты при переходах)
      const metas = document.querySelectorAll('meta[name="theme-color"]');
      
      if (metas.length > 0) {
        metas.forEach((meta) => {
          if (meta.getAttribute('content') !== targetColor) {
            meta.setAttribute('content', targetColor);
          }
        });
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'theme-color';
        newMeta.content = targetColor;
        document.head.appendChild(newMeta);
      }

      // Намертво вырезаем любые инлайновые стили color-scheme, которые Next/Tailwind могут вернуть в DOM
      document.documentElement.style.removeProperty('color-scheme');
    };

    // Вызываем сразу
    enforceColor();

    // Настраиваем жесткую слежку за заголовком <head> на случай, если Next.js затрет тег при переходе
    const observer = new MutationObserver(() => {
      enforceColor();
    });

    observer.observe(document.head, { 
      childList: true, 
      subtree: true, 
      attributes: true 
    });

    return () => observer.disconnect();
  }, [pathname]); // Перезапускаем эффект при КАЖДОМ смене экрана/роута!

  return (
    /* Наша физическая темная маска-заглушка из прошлого шага (План Б) */
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'env(safe-area-inset-top, 0px)', 
        backgroundColor: '#121212', 
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  );
}
