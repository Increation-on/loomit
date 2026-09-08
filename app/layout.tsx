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
  viewportFit: "cover", 
  themeColor: "#121212"
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ru" className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased dark`} suppressHydrationWarning>
      <head>
        {/* Жесткий нативный фикс: перебивает дефолтный сброс браузера при перезагрузке */}
        <meta name="theme-color" content="#121212" />
      </head>
      <body className="min-h-full flex flex-col transition-colors duration-200">
        <Providers session={session}>
            <StatusBarSync />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </Providers>
      </body>
    </html>
  );
}



