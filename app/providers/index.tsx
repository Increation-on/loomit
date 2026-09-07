'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/store';
import { ToastContainer } from '@/components/ui/feedback/ToastContainer';
import { useEffect } from 'react';
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
              {children}
            </NavigationProvider>
          </ToastContainer>
        </PersistGate>
      </ReduxProvider>
    </SessionProvider>
  );
}
