// src/components/ui/feedback/ToastContainer.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { Toast, ToastType } from './Toast';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration: number | null;
}

const DEFAULT_DURATIONS: Record<ToastType, number | null> = {
  success: 4000,
  info: 5000,
  warning: 7000,
  error: null,
};

const MAX_TOASTS = 5;

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number | null) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastContainer');
  }
  return context;
};

export function ToastContainer({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const idRef = useRef(0);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType, duration?: number | null) => {
      const id = `toast-${++idRef.current}`;
      setToasts((prev) => {
        const next: ToastMessage[] = [
          ...prev,
          { id, message, type, duration: duration ?? DEFAULT_DURATIONS[type] },
        ];
        return next.length > MAX_TOASTS ? next.slice(-MAX_TOASTS) : next;
      });
    },
    []
  );

  const success = useCallback((m: string) => showToast(m, 'success'), [showToast]);
  const error = useCallback((m: string) => showToast(m, 'error'), [showToast]);
  const info = useCallback((m: string) => showToast(m, 'info'), [showToast]);
  const warning = useCallback((m: string) => showToast(m, 'warning'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed top-4 right-4 z-50 flex max-w-[90vw] flex-col gap-3"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full">
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
