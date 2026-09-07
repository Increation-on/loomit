'use client';

import { useState, useEffect } from 'react';

export function useTheme() {
  // На сервере всегда инициализируем 'dark' (чтобы совпадало с SSR)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  // 1. Этот эффект срабатывает ОДИН раз при монтировании на клиенте
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    
    setTheme(initial);
  }, []);

  // 2. Этот эффект следит за изменением темы и синхронизирует DOM и статус-бар
  useEffect(() => {
    if (!mounted) return;

    const isDark = theme === 'dark';

    // Переключаем класс для стилей в globals.css
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);

    // Динамически меняем цвет подложки статус-бара в PWA
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', isDark ? '#000000' : '#FFFFFF');
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme, mounted };
}
