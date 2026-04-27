'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider as ReduxStoreProvider } from 'react-redux';
import { store } from '@/store/store';
import { ToastContainer } from '@/components/ui/feedback/ToastContainer';
import { ThemeProvider } from './ThemeProvider';
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
      <ReduxStoreProvider store={store}>
        <ThemeProvider>
          <ToastContainer>
            {children}
          </ToastContainer>
        </ThemeProvider>
      </ReduxStoreProvider>
    </SessionProvider>
  );
}