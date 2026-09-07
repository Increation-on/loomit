// src/components/layout/StatusBarWrapper.tsx

'use client';

import { useEffect, useState } from 'react';

export function StatusBarWrapper() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    setTheme(initial);

    // Слушаем изменения темы
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: theme === 'dark' ? '#000000' : '#FFFFFF',
        height: 'env(safe-area-inset-top, 0px)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    />
  );
}