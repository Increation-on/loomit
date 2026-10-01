'use client';

import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';

export function HideScrollbar() {
  const hideNavigation = usePWA();

  useEffect(() => {
  const root = document.documentElement;
  const body = document.body;

  if (hideNavigation) {
    root.classList.add('hide-scrollbar');
    body.classList.add('hide-scrollbar');
  } else {
    root.classList.remove('hide-scrollbar');
    body.classList.remove('hide-scrollbar');
  }

  return () => {
    root.classList.remove('hide-scrollbar');
    body.classList.remove('hide-scrollbar');
  };
}, [hideNavigation]);

  return null;
}