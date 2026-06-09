'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useMediaQuery } from 'usehooks-ts';
import NetworkIndicator from '@/components/ui/feedback/NetworkIndicator';
import { ThemeToggle } from '@/components/ui/core/ThemeToggle';
import { HeaderNavbar } from './HeaderNavbar';
import { User } from 'lucide-react';

export default function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const userName = session?.user?.name || 'пользователь';

  // Мобильная версия
  if (!isDesktop) {
    return (
      <header className="border-b border-loom-purple/20 bg-(--loom-black) sticky top-0 z-10 px-4 h-16 flex items-center justify-between">
        <Link href="/" className="shrink-0 -ml-3.5">
          <img
            src="/logo.png"
            alt="LOOMIT"
            className="h-28 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-3">
          {/* Приветствие */}
          <div className="text-left">
            <p className="text-sm text-gray-500 leading-none">Hello,</p>
            <p className="font-semibold text-loom-white">
              {userName}
            </p>
          </div>

          {/* Аватар (кликабельный) */}
          <Link href="/profile">
            <div className="w-10 h-10 rounded-full bg-(--loom-purple) flex items-center justify-center font-bold text-lg text-loom-black">
              {userName?.[0] || '?'}
            </div>
          </Link>
        </div>
      </header>
    );
  }

  // Десктопная версия (остаётся как есть)
  return (
    <header className="border-b border-loom-purple/20 bg-loom-black sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-loom-yellow">
          LoomIt
        </Link>

        <HeaderNavbar />

        <div className="flex items-center gap-3">
          <NetworkIndicator />
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-loom-white">
                {session?.user?.name || session?.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm bg-loom-pink text-loom-white px-4 py-2 rounded-lg hover:opacity-80 transition"
              >
                Выйти
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-loom-cyan text-loom-black px-4 py-2 rounded-lg hover:opacity-80 transition"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}