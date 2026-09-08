'use client';

import { useEffect } from 'react';

export function StatusBarSync() {
  useEffect(() => {
    // Намертво держим мета-тег, предотвращая его сброс
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
  },);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        // Высота строго равна системному отступу статус-бара
        height: 'env(safe-area-inset-top, 0px)', 
        // Жесткий, не зависящий от тем и переменных цвет Плана Б
        backgroundColor: '#121212', 
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  );
}
