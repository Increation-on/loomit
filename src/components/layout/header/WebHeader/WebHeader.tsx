/* eslint-disable @next/next/no-img-element */
'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useMediaQuery } from 'usehooks-ts';
import NetworkIndicator from '@/components/ui/feedback/NetworkIndicator';
import { ThemeToggle } from '@/components/ui/core/ThemeToggle';
import { HeaderNavbar } from '../../HeaderNavbar';

export default function WebHeader() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const userName = session?.user?.name || 'пользователь';

  // Мобильная версия
  if (!isDesktop) {
    const displayName = isAuthenticated ? userName : 'Гость';
    const avatarLetter = isAuthenticated ? userName?.[0] : '?';

    return (
      <header className="flex h-18 items-center justify-between bg-(--loom-black) px-4">
        <div className="absolute bottom-2 left-0 w-full px-4">
          <img
            src="/glitch-line.png"
            alt="glitch line"
            className="pointer-events-none z-20 h-0.5 w-full object-cover"
          />
        </div>

        <Link href="/" className="-ml-3.5 shrink-0">
          <img src="/logo.png" alt="LOOMIT" className="h-22 w-auto object-contain" />
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="text-left">
                <p className="text-xs leading-none text-gray-500">Hello,</p>
                <p className="text-sm font-semibold text-(--loom-white)">{displayName}</p>
              </div>
              <Link href="/profile">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--loom-magenta) text-sm font-bold text-(--loom-white)">
                  {avatarLetter}
                </div>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <div className="glitch-border flex items-center gap-3 rounded-xl bg-(--loom-white)/5 px-4 py-2 transition-colors hover:bg-(--loom-white)/10">
                <span className="text-sm text-(--loom-white)">Войти</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--loom-white)/10 text-sm text-(--loom-white)/60">
                  ?
                </div>
              </div>
            </Link>
          )}
        </div>
      </header>
    );
  }

  // Десктопная версия (остаётся как есть)
  return (
    <header className="border-loom-purple/20 bg-loom-black sticky top-0 z-10 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-loom-yellow text-xl font-bold">
          LoomIt
        </Link>

        <HeaderNavbar />

        <div className="flex items-center gap-3">
          <NetworkIndicator />
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-loom-white text-sm">
                {session?.user?.name || session?.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="bg-loom-pink text-loom-white rounded-lg px-4 py-2 text-sm transition hover:opacity-80"
              >
                Выйти
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-loom-cyan text-loom-black rounded-lg px-4 py-2 text-sm transition hover:opacity-80"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
