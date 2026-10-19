// src/components/ui/feedback/Toast.tsx
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

const iconMap = {
  success: '✓',
  error: '✗',
  info: 'ℹ',
  warning: '⚠',
};

const colorMap = {
  success: 'text-(--loom-cyan)',
  error: 'text-red-500',
  info: 'text-(--loom-cyan)',
  warning: 'text-(--loom-yellow)',
};

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        'fixed right-4 bottom-4 z-50 flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg',
        'glitch-border bg-(--loom-black)',
        'animate-slide-up transition-all duration-300',
        !isVisible && 'translate-y-2 opacity-0'
      )}
      role="alert"
    >
      <span className={cn('text-lg font-bold', colorMap[type])}>{iconMap[type]}</span>
      <span className="text-sm text-(--loom-white)">{message}</span>
    </div>
  );
}
