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

// Отдельный изолированный компонент для управления статус-баром PWA
function PWAStatusBarSync() {
  const { theme } = useTheme();

  useEffect(() => {
    // Вручную маппим цвета для перезаписи нативного контейнера Android
    const activeColor = theme === 'dark' ? '#000000' : '#FFFFFF'; 
    const metaTags = document.querySelectorAll('meta[name="theme-color"]');
    
    if (metaTags.length === 0) {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      meta.setAttribute('content', activeColor);
      document.head.appendChild(meta);
    } else {
      // Принудительно обновляем все мета-теги, включая сгенерированные Next.js
      metaTags.forEach((meta) => {
        meta.setAttribute('content', activeColor);
      });
    }
  }, [theme]);

  return null;
}


export function Providers({ 
  children, 
  session 
}: { 
  children: React.ReactNode;
  session: Session | null;
}) {
  const isPWA = usePWA();

  useEffect(() => {
    if (isPWA) {
      document.documentElement.classList.add('pwa-mode');
    } else {
      document.documentElement.classList.remove('pwa-mode');
    }
  }, [isPWA]);

  return (
    <SessionProvider session={session}>
      <ReduxProvider store={store}>
        <PersistGate loading={<div className="p-4 text-center text-loom-white">Загрузка...</div>} persistor={persistor}>
          <ToastContainer>
            <NavigationProvider>
              {/* Подключаем наш синхронизатор цвета */}
              <PWAStatusBarSync />
              {children}
            </NavigationProvider>
          </ToastContainer>
        </PersistGate>
      </ReduxProvider>
    </SessionProvider>
  );
}
