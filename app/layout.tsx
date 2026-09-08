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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  // Задаем базовые нативные цвета для системных тем на старте (до загрузки JS)
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" }
  ]
};

export const metadata: Metadata = {
  title: "LoomIt — Квизы по собеседованиям",
  description: "Проходи квизы, готовься к собеседованиям, сохраняй прогресс",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // На iOS статус-бар станет прозрачным и примет цвет body
    title: "LoomIt",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ru" className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Базовый мета-тег, который мы будем динамически "шатать" через JavaScript */}
        <meta name="theme-color" content="#121212" />
      </head>
      <body className="min-h-full flex flex-col transition-colors duration-200">
        <Providers session={session}>
            {/* Невидимый компонент, который будет слушать изменения темы и перекрашивать статус-бар */}
            <StatusBarSync/>
            
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </Providers>
      </body>
    </html>
  );
}
