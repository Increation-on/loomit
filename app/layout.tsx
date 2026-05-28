import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-display'
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-body'
})

export const viewport: Viewport = {
  themeColor: "#0f0f23",
};

export const metadata: Metadata = {
  title: "LoomIt — Квизы по собеседованиям",
  description: "Проходи квизы, готовься к собеседованиям, сохраняй прогресс",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LoomIt",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html
      lang="ru"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
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