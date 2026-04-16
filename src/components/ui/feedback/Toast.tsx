// src/components/ui/Toast.tsx
'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const typeStyles = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
  warning: 'bg-yellow-500 text-white',
};

const icons = {
  success: '✓',
  error: '✗',
  info: 'ℹ',
  warning: '⚠',
};

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // даём время на анимацию
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg',
        'animate-slide-up transition-all duration-300',
        typeStyles[type],
        !isVisible && 'opacity-0 translate-y-2'
      )}
      role="alert"
    >
      <span className="text-lg font-bold">{icons[type]}</span>
      <span className="text-sm">{message}</span>
    </div>
  );
}