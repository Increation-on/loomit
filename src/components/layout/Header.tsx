'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import NetworkIndicator from '@/components/ui/feedback/NetworkIndicator';
import { ThemeToggle } from '@/components/ui/core/ThemeToggle';

export default function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <header className="border-b border-loom-purple/20 bg-loom-black sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-loom-yellow">
          LoomIt
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link href="/" className="hover:text-loom-cyan text-loom-white">
            Главная
          </Link>
          <Link href="/profile" className="hover:text-loom-cyan text-loom-white">
            Профиль
          </Link>
        </nav>

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