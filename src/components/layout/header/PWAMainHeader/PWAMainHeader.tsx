/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { Settings } from 'lucide-react';
import { GlitchLine } from '@/components/common/GlitchLine';

export default function PWAMainHeader() {
  return (
    <header
      className="sticky top-0 z-50 flex h-14 w-full items-center justify-between px-4 backdrop-blur-sm"
      style={{ backgroundColor: 'var(--nav-bg)' }}
    >
      <Link href="/" className="shrink-0">
        <img src="/logo.png" alt="LOOMIT" className="h-18 w-auto object-contain" />
      </Link>

      <Link
        href="/profile/settings"
        className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
      >
        <Settings className="h-6 w-6 text-(--loom-white)" />
      </Link>

      <GlitchLine />
    </header>
  );
}
