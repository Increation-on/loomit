'use client';

import { GlitchLine } from '@/components/common/GlitchLine';
import { BackLink } from '@/components/navigation/BackLink';

interface PWAHeaderProps {
  title: string;
  showBack?: boolean;
  fallback?: string | null;
}

export default function PWAHeader({ title, showBack = false, fallback }: PWAHeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 flex h-12 w-full items-center px-4 backdrop-blur-sm"
      style={{ backgroundColor: 'var(--nav-bg)' }}
    >
      <div className="flex w-10 shrink-0 items-center justify-start">
        {showBack && (
          <BackLink
            fallback={fallback ?? '/'}
            label=""
            iconSize={24}
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 active:scale-100"
          />
        )}
      </div>

      <div className="flex-1 text-center">
        <h1 className="truncate text-base font-semibold text-(--loom-white)">{title}</h1>
      </div>

      <div className="w-10 shrink-0" />

      <GlitchLine />
    </header>
  );
}
