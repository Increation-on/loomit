// app/providers/index.tsx

'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/store';
import { ToastContainer } from '@/components/ui/feedback/ToastContainer';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { usePWA } from '@/hooks/usePWA';
import { NavigationProvider } from '@/components/layout/NavigationProvider';

import { Session } from 'next-auth';

export function Providers({ 
  children, 
  session 
}: { 
  children: React.ReactNode;
  session: Session | null;
}) {
  const pathname = usePathname();
  const { mounted } = useTheme();
  const isPWA = usePWA();

  useEffect(() => {
    if (isPWA) {
      document.documentElement.classList.add('pwa-mode');
    } else {
      document.documentElement.classList.remove('pwa-mode');
    }
  }, [isPWA]);

  useEffect(() => {
    const updateMeta = () => {
      const isDark = document.documentElement.classList.contains('dark');
      let meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'theme-color');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', isDark ? '#000000' : '#FFFFFF');
    };

    updateMeta();
    const observer = new MutationObserver(() => updateMeta());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [pathname]);

  if (!mounted) {
    return <div className="h-screen bg-(--loom-black)" />;
  }

  return (
    <SessionProvider session={session}>
      <ReduxProvider store={store}>
        <PersistGate loading={<div className="p-4 text-center text-loom-white">Загрузка...</div>} persistor={persistor}>
          <ToastContainer>
            <NavigationProvider>  {/* 👈 обёртка здесь */}
              {children}
            </NavigationProvider>
          </ToastContainer>
        </PersistGate>
      </ReduxProvider>
    </SessionProvider>
  );
}