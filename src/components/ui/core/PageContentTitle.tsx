'use client';

import { BackLink } from '@/components/navigation/BackLink';
import { usePWA } from '@/hooks/usePWA';


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

  // В PWA ничего не рендерим, так как всё это уже показывает PageHeader
  if (isPWA) return null;

  return (
    <div className={`mb-6 flex flex-col gap-3 ${className || ''}`}>
      {showBack && <BackLink fallback={fallback} />}
      <h1 className="font-display text-2xl font-bold text-(--loom-white) sm:text-3xl">
        {title}
      </h1>
    </div>
  );
}
