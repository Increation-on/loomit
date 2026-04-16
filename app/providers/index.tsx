'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider as ReduxStoreProvider } from 'react-redux';
import { store } from '@/store/store';
import { ToastContainer } from '@/components/ui/feedback/ToastContainer';
import { ThemeProvider } from './ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
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