'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/store';
import { ToastContainer } from '@/components/ui/feedback/ToastContainer';

import { Session } from 'next-auth';

export function Providers({ 
  children, 
  session 
}: { 
  children: React.ReactNode;
  session: Session | null;
}) {
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