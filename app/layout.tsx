import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";
import { useEffect, useState } from "react";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display'
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body'
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "LoomIt — Квизы по собеседованиям",
  description: "Проходи квизы, готовься к собеседованиям, сохраняй прогресс",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default", // ← меняем на default, чтобы текст был чёрным
    title: "LoomIt",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="ru"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        {/* 👇 СВОЙ СТАТУС-БАР (имитация) */}
        <StatusBarWrapper />
        <Providers session={session}>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
        </Providers>
      </body>
    </html>
  );
}

// 👇 Компонент-имитация статус-бара
function StatusBarWrapper() {
  'use client';
  
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: theme === 'dark' ? '#000000' : '#FFFFFF',
        height: 'env(safe-area-inset-top, 0px)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    />
  );
}