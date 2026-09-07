'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/store';
import { ToastContainer } from '@/components/ui/feedback/ToastContainer';
import { useEffect } from 'react';
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
  const { theme, mounted } = useTheme(); // ← добавили theme
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

      const bgColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--loom-black')
        .trim();

      const color = bgColor || (isDark ? '#000000' : '#FFFFFF');
      meta.setAttribute('content', color);
    };

    updateMeta();
  }, [theme]); // ← теперь обновляется при смене темы

  if (!mounted) {
    return <div className="h-screen bg-(--loom-black)" />;
  }

  return (
    <SessionProvider session={session}>
      <ReduxProvider store={store}>
        <PersistGate loading={<div className="p-4 text-center text-loom-white">Загрузка...</div>} persistor={persistor}>
          <ToastContainer>
            <NavigationProvider>
              {children}
            </NavigationProvider>
          </ToastContainer>
        </PersistGate>
      </ReduxProvider>
    </SessionProvider>
  );
}