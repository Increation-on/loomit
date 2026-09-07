'use client';

import { useSyncExternalStore, useEffect } from 'react';

// Функция-заглушка для сервера (SSR всегда рендерит 'dark')
const getServerSnapshot = () => 'dark' as const;

// Функция для чтения темы на клиенте
const getClientSnapshot = () => {
  if (typeof window === 'undefined') return 'dark';
  
  // 1. Ищем явно сохраненную тему пользователя
  const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
  if (saved) return saved;
  
  // 2. Если в localStorage ничего нет (первый заход), 
  // МЫ ПРИНУДИТЕЛЬНО возвращаем 'dark', игнорируя светлую систему телефона!
  return 'dark'; 
};

// Подписка на изменения (нужна для React, чтобы он знал, когда перерендерить компонент)
const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback); // Реагирует, если тема изменилась в другой вкладке
  return () => window.removeEventListener('storage', callback);
};

export function useTheme() {
  // Нативно синхронизирует сервер и клиент без каскадных setState!
  const theme = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  // Класс на HTML вешаем в обычном побочном эффекте, он ничего не рендерит
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    // Принудительно триггерим событие, чтобы обновить стейт в текущей вкладке
    window.dispatchEvent(new Event('storage'));
  };

  return { theme, toggleTheme };
}
