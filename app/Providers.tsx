// app/Providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store/store';
import { ToastContainer } from '@/components/ui/feedback/ToastContainer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <ToastContainer>
          {children}
        </ToastContainer>
      </ReduxProvider>
    </SessionProvider>
  );
}