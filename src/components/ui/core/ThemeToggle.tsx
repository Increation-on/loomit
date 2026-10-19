'use client';

import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Переключить тему"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
