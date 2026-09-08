'use client';

import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  // 1. Первый хук: Срабатывает СТРОГО один раз при монтировании клиента
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Если в localStorage ничего нет, по умолчанию ставим dark
    const initial = saved || (prefersDark ? 'dark' : 'dark'); 
    setTheme(initial);
  }, []); // Передали [] — выполнится один раз, бесконечного цикла не будет

  // 2. Второй хук: Реагирует только на изменение стейта темы пользователем
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light'); // Вычищаем старые следы
    } else {
      // ОБМАН ONE UI: Удаляем .dark, чтобы включить базовый светлый CSS,
      // но НЕ вешаем класс .light, чтобы Samsung S25 не сделал часы чёрными.
      root.classList.remove('dark');
      root.classList.remove('light'); 
    }
    
    localStorage.setItem('theme', theme);
  }, [theme, mounted]); // Зависимости указаны корректно, линтер будет доволен

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme, mounted };
}
