'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/store';
import { ToastContainer } from '@/components/ui/feedback/ToastContainer';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { Session } from 'next-auth';

export function Providers({ 
  children, 
  session 
}: { 
  children: React.ReactNode;
  session: Session | null;
}) {
  const pathname = usePathname();

  // Следим за классом dark на html
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

    // Обновляем при первом рендере
    updateMeta();

    // Следим за изменениями класса dark с помощью MutationObserver
    const observer = new MutationObserver(() => updateMeta());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <SessionProvider session={session}>
      <ReduxProvider store={store}>
        <PersistGate loading={<div className="p-4 text-center text-loom-white">Загрузка...</div>} persistor={persistor}>
          <ToastContainer>
            {children}
          </ToastContainer>
        </PersistGate>
      </ReduxProvider>
    </SessionProvider>
  );
}