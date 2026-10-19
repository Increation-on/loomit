// src/components/layout/header/AppHeader.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux'; // <-- Используем стандартный useSelector
import { selectHeaderState } from '@/store/slices/headerSlice';
import { usePWA } from '@/hooks/usePWA'; // <-- Твой хук
import { SkeletonHeader } from '@/components/ui/feedback/Skeleton';
import MainHeader from './MainHeader/MainHeader';
import PageHeader from './PageHeader/PageHeader';
import WebHeader from './WebHeader/WebHeader';



export const AppHeader = () => {
  const isPWA = usePWA(); // <-- Твой хук
  const pathname = usePathname();
  const { variant, path, title, showBack } = useSelector(selectHeaderState); // <-- Стандартный useSelector

  // 1. Если не PWA — показываем старый веб-хедер
  if (!isPWA) {
    return <WebHeader />;
  }

  // 2. Если страница сказала скрыть хедер (квиз)
  if (variant === 'hidden') {
    return null;
  }

  // 3. Защита от моргания: если стейт пустой или путь не совпадает с текущим
  if (!variant || path !== pathname) {
    return <SkeletonHeader />;
  }

  // 4. Рендерим нужный вариант
  switch (variant) {
    case 'main':
      return <MainHeader />;
    case 'tab':
    case 'nested': // Объединили в PageHeader
      return <PageHeader title={title} showBack={showBack} />;
    default:
      return null;
  }
};
