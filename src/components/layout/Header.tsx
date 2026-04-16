// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NetworkIndicator from '@/components/ui/feedback/NetworkIndicator';
import Logo from '../ui/core/Logo';
import { HeaderNavbar } from './HeaderNavbar';
import { ThemeToggle } from '../ui/core/ThemeToggle';


export default function Header() {
  const pathname = usePathname();
  
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Логотип */}
       <Logo/>
        
        {/* Навигация */}
       <HeaderNavbar/>
       
        {/* Индикатор сети + Кнопка профиля */}
        <div className="flex items-center gap-3">
          <NetworkIndicator />
          <ThemeToggle />
          <Link 
            href="/profile" 
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Профиль
          </Link>
        </div>
      </div>
    </header>
  );
}