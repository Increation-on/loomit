'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useAppDispatch, store } from '@/store/store';
import { selectHeaderState, resetHeader } from '@/store/slices/headerSlice';
import { usePWA } from '@/hooks/usePWA';
import { SkeletonHeader } from '@/components/ui/feedback/Skeleton';

import WebHeader from './WebHeader/WebHeader';
import PWAHeader from './PWAHeader/PWAHeader';
import PWAMainHeader from './PWAMainHeader/PWAMainHeader';

export function AppHeader() {
  const isPWA = usePWA();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { variant, path, title, showBack } = useSelector(selectHeaderState);

  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      const timeout = setTimeout(() => {
        // Читаем актуальный path напрямую из Redux
        const currentPath = store.getState().header.path;
        
        if (currentPath !== pathname) {
          dispatch(resetHeader());
        }
      }, 0);

      prevPathname.current = pathname;
      return () => clearTimeout(timeout);
    }
  }, [pathname, dispatch]);

  // 1. Если не PWA — показываем старый веб-хедер
  if (!isPWA) {
    return <WebHeader />;
  }

  // 2. Если страница сказала скрыть хедер (квиз)
  if (variant === 'hidden') {
    return null;
  }

  // 3. Если стейт пустой
  if (!variant) {
    return null;
  }

  // 4. Защита от моргания
  if (path !== pathname) {
    return <SkeletonHeader />;
  }

  // 5. Рендерим нужный вариант
  switch (variant) {
    case 'main':
      return <PWAMainHeader />;
    case 'tab':
    case 'nested':
      return <PWAHeader title={title} showBack={showBack} />;
    default:
      return null;
  }
}
