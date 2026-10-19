// src/components/layout/header/MainHeader/MainHeader.tsx
/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { Settings } from 'lucide-react'; // Предполагаю lucide, если нет — замени

export const MainHeader = () => {
  return (
    <header 
      className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b px-4 backdrop-blur-md"
      style={{
        backgroundColor: 'var(--nav-bg)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Логотип слева */}
      <Link href="/" className="shrink-0">
        <img
          src="/logo.png"
          alt="LOOMIT"
          className="h-10 w-auto object-contain"
        />
      </Link>

      {/* Иконка настроек справа */}
      <Link 
        href="/settings" 
        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
      >
        <Settings className="h-5 w-5 text-(--loom-white)" />
      </Link>
    </header>
  );
};
