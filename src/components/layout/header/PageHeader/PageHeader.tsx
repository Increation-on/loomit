// src/components/layout/header/PageHeader/PageHeader.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

export const PageHeader = ({ title, showBack = false }: PageHeaderProps) => {
  const router = useRouter();

  return (
    <header 
      className="sticky top-0 z-50 flex h-14 w-full items-center border-b px-4 backdrop-blur-md"
      style={{
        backgroundColor: 'var(--nav-bg)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Левая часть (кнопка Назад или пустое место для центрирования) */}
      <div className="flex w-10 shrink-0 items-center justify-start">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors -ml-2"
            aria-label="Назад"
          >
            <ChevronLeft className="h-6 w-6 text-(--loom-white)" />
          </button>
        )}
      </div>

      {/* Центральная часть (Заголовок) */}
      <div className="flex-1 text-center">
        <h1 className="truncate text-base font-semibold text-(--loom-white)">
          {title}
        </h1>
      </div>

      {/* Правая часть (пустая для баланса, w-10 = w-10 левой части) */}
      <div className="w-10 shrink-0" />
    </header>
  );
};
