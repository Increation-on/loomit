import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display'
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body'
});

// Нативный themeColor для PWA (отслеживает системную тему устройства)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  // Вместо жестких HEX-кодов заставляем браузер привязать 
  // статус-бар к вашей живой CSS-переменной из globals.css
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'var(--loom-black)' },
    { media: '(prefers-color-scheme: dark)', color: 'var(--loom-black)' },
  ],
};

export const metadata: Metadata = {
  title: "LoomIt — Квизы по собеседованиям",
  description: "Проходи квизы, готовься к собеседованиям, сохраняй прогресс",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", 
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
