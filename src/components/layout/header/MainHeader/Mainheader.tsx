/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { Settings } from 'lucide-react';

export default function MainHeader() {
  return (
    <header 
      className="sticky top-0 z-50 flex h-12 w-full items-center justify-between px-4 backdrop-blur-sm"
      style={{
        backgroundColor: 'var(--nav-bg)',
      
      }}
    >
      {/* Логотип слева */}
      <Link href="/" className="shrink-0">
        <img
          src="/logo.png"
          alt="LOOMIT"
          className="h-15 w-auto object-contain"
        />
      </Link>

      {/* Иконка настроек справа */}
      <Link 
        href="/profile/settings" 
        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
      >
        <Settings className="h-5 w-5 text-(--loom-white)" />
      </Link>

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
