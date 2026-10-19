'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

export default function PageHeader({ title, showBack = false }: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    // Проверяем, есть ли история для возврата
    if (window.history.length > 1) {
      router.back();
    } else {
      // Фолбэк: если истории нет, ведем на главную
      router.push('/'); 
    }
  };

  return (
    <header 
      className="sticky top-0 z-50 flex h-12 w-full items-center px-4 backdrop-blur-sm"
      style={{
        backgroundColor: 'var(--nav-bg)',
      }}
    >
      {/* Левая часть */}
      <div className="flex w-10 shrink-0 items-center justify-start">
        {showBack && (
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors -ml-2"
            aria-label="Назад"
          >
            <ChevronLeft className="h-6 w-6 text-(--loom-white)" />
          </button>
        )}
      </div>

      {/* Центральная часть */}
      <div className="flex-1 text-center">
        <h1 className="truncate text-base font-semibold text-(--loom-white)">
          {title}
        </h1>
      </div>

      {/* Правая часть */}
      <div className="w-10 shrink-0" />

      {/* Глитч-полоска внизу */}
      <div className="absolute bottom-0 left-0 w-full px-4 pointer-events-none">
        <img
          src="/glitch-line.png"
          alt="glitch line"
          className="w-full h-0.5 object-cover z-20"
        />
      </div>
    </header>
  );
}
