'use client';

import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectHeaderState } from '@/store/slices/headerSlice';
import { usePWA } from '@/hooks/usePWA';

import WebHeader from './WebHeader/WebHeader';
import MainHeader from './MainHeader/MainHeader';
import PageHeader from './PageHeader/PageHeader';
import { SkeletonHeader } from '@/components/ui/feedback/Skeleton';

export function AppHeader() {
  const isPWA = usePWA();
  const pathname = usePathname();
  const { variant, path, title, showBack } = useSelector(selectHeaderState);

  // 1. Если не PWA — показываем старый веб-хедер
  if (!isPWA) {
    return <WebHeader />;
  }

  // 2. Если страница сказала скрыть хедер (квиз)
  if (variant === 'hidden') {
    return null;
  }

  // 3. Если стейт вообще пустой (страница забыла вызвать usePageHeader)
  // Возвращаем null, чтобы не было вечного скелетона
  if (!variant) {
    return null;
  }

  // 4. Защита от моргания: если данные есть, но они от старой страницы
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
