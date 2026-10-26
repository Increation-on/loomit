import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Footer from '@/components/layout/Footer';
import { Providers } from './providers';
import { StatusBarSync } from '@/components/layout/StatusBarSync';
import { HideScrollbar } from '@/components/layout/HideScrollbar';
import { AppHeader } from '@/components/layout/header/AppHeader';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-body' });

// 1. Добавляем проверку окружения
const isDev = process.env.NODE_ENV === 'development';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#121212',
};

export const metadata: Metadata = {
  title: 'LoomIt — Квизы по собеседованиям',
  description: 'Проходи квизы, готовься к собеседованиям, сохраняй прогресс',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LoomIt',
  },
  // 2. Добавляем условный favicon
  icons: {
    // В dev-режиме берем иконку с иголкой из public/icons/
    // В prod-режиме Next.js автоматически возьмет app/favicon.ico
    icon: isDev ? '/icons/favicon_dev.ico' : undefined,
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="ru"
      className={`${spaceGrotesk.variable} ${inter.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Жесткий нативный фикс: перебивает дефолтный сброс браузера при перезагрузке */}
        <meta name="theme-color" content="#121212" />
      </head>
      <body className="flex min-h-full flex-col transition-colors duration-200">
        <Providers session={session}>
          <StatusBarSync />
          <HideScrollbar />
          <AppHeader />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
