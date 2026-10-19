'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectHeaderState, resetHeader } from '@/store/slices/headerSlice';
import { usePWA } from '@/hooks/usePWA';
import { SkeletonHeader } from '@/components/ui/feedback/Skeleton';
import MainHeader from './MainHeader/MainHeader';
import PageHeader from './PageHeader/PageHeader';
import WebHeader from './WebHeader/WebHeader';

export function AppHeader() {
  const isPWA = usePWA();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { variant, path, title, showBack } = useSelector(selectHeaderState);

  // Запоминаем предыдущий pathname, чтобы понять, был ли переход
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Если путь изменился, но стейт не обновился (variant все еще от старой страницы)
    if (prevPathname.current !== pathname) {
      
      // Даем странице шанс вызвать usePageHeader (через микротаск)
      const timeout = setTimeout(() => {
        if (path !== pathname) {
          dispatch(resetHeader());
        }
      }, 0);

      prevPathname.current = pathname;
      return () => clearTimeout(timeout);
    }
  }, [pathname, path, dispatch]);

  // 1. Если не PWA — показываем старый веб-хедер
  if (!isPWA) {
    return <WebHeader />;
  }

  // 2. Если страница сказала скрыть хедер (квиз)
  if (variant === 'hidden') {
    return null;
  }

  // 3. Если стейт пустой (страница забыла вызвать usePageHeader)
  // или если мы только что сбросили его через useEffect
  if (!variant) {
    return null;
  }

  // 4. Защита от моргания: данные есть, но они от старой страницы
  if (path !== pathname) {
    return <SkeletonHeader />;
  }

  // 5. Рендерим нужный вариант
  switch (variant) {
    case 'main':
      return <MainHeader />;
    case 'tab':
    case 'nested':
      return <PageHeader title={title} showBack={showBack} />;
    default:
      return null;
  }
}
