'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Book, Star, User } from 'lucide-react';
import { useMediaQuery } from 'usehooks-ts';
import AnimatedLink from '../navigation/AnimatedLink';

export default function Footer() {
  const pathname = usePathname();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Скрываем футер на страницах создания и редактирования квиза
  if (pathname?.startsWith('/admin/quiz/')) {
    return null;
  }

  // Десктопная версия
  if (isDesktop) {
    return (
      <footer className="mt-auto border-t bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} LoomIt. Все права защищены.</p>
            <p className="mt-1 text-xs">Создавайте и проходите квизы даже без интернета</p>
          </div>
        </div>
      </footer>
    );
  }

  // Мобильная версия (Bottom Nav)
  return (
    <nav className="pb-safe fixed right-0 bottom-0 left-0 z-50 bg-(--nav-bg) backdrop-blur-lg">
      {/* Глитч-линия прямо над навбаром */}
      <div className="absolute top-0 left-0 w-full px-4">
        <img
          src="/glitch-line.png"
          alt="glitch line"
          className="pointer-events-none h-0.5 w-full object-cover"
        />
      </div>

      <div className="relative z-10 mx-auto flex h-16 max-w-md items-center justify-around">
        <AnimatedLink
          href="/"
          onContextMenu={(e) => e.preventDefault()}
          className={`flex flex-col items-center gap-1 transition-all duration-100 ${
            pathname === '/'
              ? 'text-(--loom-yellow)'
              : 'text-(--loom-white)/40 hover:text-(--loom-white)'
          } active:translate-y-1 active:text-(--loom-yellow) active:opacity-50`}
        >
          <Home size={24} />
          <span className="text-xs">Главная</span>
        </AnimatedLink>

        <AnimatedLink
          href="/catalog"
          onContextMenu={(e) => e.preventDefault()}
          className={`flex flex-col items-center gap-1 transition-all duration-100 ${
            pathname === '/catalog'
              ? 'text-(--loom-yellow)'
              : 'text-(--loom-white)/40 hover:text-(--loom-white)'
          } active:translate-y-1 active:text-(--loom-yellow) active:opacity-50`}
        >
          <Book size={24} />
          <span className="text-xs">Каталог</span>
        </AnimatedLink>

        <AnimatedLink
          href="/favorites"
          onContextMenu={(e) => e.preventDefault()}
          className={`flex flex-col items-center gap-1 transition-all duration-100 ${
            pathname === '/favorites'
              ? 'text-(--loom-yellow)'
              : 'text-(--loom-white)/40 hover:text-(--loom-white)'
          } active:translate-y-1 active:text-(--loom-yellow) active:opacity-50`}
        >
          <Star size={24} />
          <span className="text-xs">Избранное</span>
        </AnimatedLink>

        <AnimatedLink
          href="/profile"
          onContextMenu={(e) => e.preventDefault()}
          className={`flex flex-col items-center gap-1 transition-all duration-100 ${
            pathname === '/profile'
              ? 'text-(--loom-yellow)'
              : 'text-(--loom-white)/40 hover:text-(--loom-white)'
          } active:translate-y-1 active:text-(--loom-yellow) active:opacity-50`}
        >
          <User size={24} />
          <span className="text-xs">Профиль</span>
        </AnimatedLink>
      </div>
    </nav>
  );
}
