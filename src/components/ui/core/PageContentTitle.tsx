'use client';

import { BackLink } from '@/components/navigation/BackLink';
import { usePWA } from '@/hooks/usePWA';
import { useQuizFontSize } from '@/hooks/useQuizFontSize'; // Укажи правильный путь к хуку

interface PageContentTitleProps {
  title: string;
  showBack?: boolean;
  fallback?: string;
  className?: string;
}

export function PageContentTitle({ 
  title, 
  showBack = true, 
  fallback,
  className 
}: PageContentTitleProps) {
  const isPWA = usePWA();
  
  const { fontSize, isReady, ref } = useQuizFontSize({
    text: title,
    maxFontSize: 24, 
    minFontSize: 14,
    step: 1,
    mode: 'dom',
  });

  if (isPWA) return null;

  return (
    <div className={`mb-6 flex items-center gap-3 ${className || ''}`}>
      {/* Левая часть: стрелка */}
      <div className="flex w-10 shrink-0 justify-start">
        {showBack && <BackLink fallback={fallback} label="" />}
      </div>

      {/* Центральная часть с хуком */}
      <div 
        className="flex h-10 flex-1 items-center justify-center overflow-hidden" 
        style={{ opacity: isReady ? 1 : 0 }} // Скрываем, пока хук считает размер
      >
        <h1 
          ref={ref as any} 
          className="w-full text-center font-display font-bold text-(--loom-white) leading-tight"
          style={{ fontSize: `${fontSize}px` }}
        >
          {title}
        </h1>
      </div>

      {/* Правая часть: пустая заглушка для центрирования */}
      <div className="w-10 shrink-0" />
    </div>
  );
}
