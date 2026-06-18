// src/components/layout/Footer.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Book, Star, User } from 'lucide-react';
import { useMediaQuery } from 'usehooks-ts';

export default function Footer() {
  const pathname = usePathname();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Скрываем футер на странице админки
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Десктопная версия (старый футер)
  if (isDesktop) {
    return (
      <footer className="border-t bg-gray-50 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} LoomIt. Все права защищены.</p>
            <p className="text-xs mt-1">Создавайте и проходите квизы даже без интернета</p>
          </div>
        </div>
      </footer>
    );
  }

  // Мобильная версия (Bottom Nav)
return (
  <nav className="fixed bottom-0 left-0 right-0 bg-(--nav-bg) backdrop-blur-lg z-50 pb-safe">
    
    {/* Глитч-линия прямо над навбаром (вместо обычного border-t) */}
    <div className="absolute top-0 left-0 w-full px-4">
      <img 
        src="/glitch-line.png" 
        alt="glitch line" 
        className="w-full h-0.5 object-cover pointer-events-none" 
      />
    </div>

    <div className="flex justify-around items-center h-16 max-w-md mx-auto relative z-10">
      <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-(--loom-yellow)' : 'text-gray-500'}`}>
        <Home size={24} />
        <span className="text-xs">Главная</span>
      </Link>
      <Link href="/catalog" className={`flex flex-col items-center gap-1 ${pathname === '/catalog' ? 'text-(--loom-yellow)' : 'text-gray-500'}`}>
        <Book size={24} />
        <span className="text-xs">Каталог</span>
      </Link>
      <Link href="/favorites" className={`flex flex-col items-center gap-1 ${pathname === '/favorites' ? 'text-(--loom-yellow)' : 'text-gray-500'}`}>
        <Star size={24} />
        <span className="text-xs">Избранное</span>
      </Link>
      <Link href="/profile" className={`flex flex-col items-center gap-1 ${pathname === '/profile' ? 'text-(--loom-yellow)' : 'text-gray-500'}`}>
        <User size={24} />
        <span className="text-xs">Профиль</span>
      </Link>
    </div>
  </nav>
);
}