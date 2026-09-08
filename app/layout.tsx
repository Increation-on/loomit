import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";
import { StatusBarSync } from "@/components/layout/StatusBarSync";

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-body' });

// Настраиваем вьюпорт для SSR. 
// viewportFit: "cover" заставит PWA на Samsung заходить под статус-бар, убирая серые разделительные плашки
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
  ],
};

export const metadata: Metadata = {
  title: "LoomIt — Квизы по собеседованиям",
  description: "Проходи квизы, готовься к собеседованиям, сохраняй прогресс",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // Для iOS тоже делаем бесшовное слияние с темным фоном
    title: "LoomIt",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  return (
    // Принудительно ставим класс "dark" на html для темной темы по умолчанию при SSR,
    // чтобы избежать белой вспышки при первой загрузке приложения
    <html 
      lang="ru" 
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased dark`} 
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#121212] text-white">
        <Providers session={session}>
            {/* Клиентский синхронизатор статус-бара (логи уберем внутри него) */}
            <StatusBarSync />
            
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </Providers>
      </body>
    </html>
  );
}
