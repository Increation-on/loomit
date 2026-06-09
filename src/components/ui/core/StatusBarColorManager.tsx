// components/StatusBarColorManager.tsx
'use client';

import { useTheme } from '@/hooks/useTheme';
import { useEffect } from 'react';

export function StatusBarColorManager() {
  const { theme } = useTheme();

  useEffect(() => {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', theme === 'dark' ? '#000000' : '#FFFFFF');
  }, [theme]);

  return null;
}