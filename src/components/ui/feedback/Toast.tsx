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
        'fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg',
        'bg-(--loom-black) glitch-border',
        'animate-slide-up transition-all duration-300',
        !isVisible && 'opacity-0 translate-y-2'
      )}
      role="alert"
    >
      <span className={cn('text-lg font-bold', colorMap[type])}>
        {iconMap[type]}
      </span>
      <span className="text-sm text-(--loom-white)">
        {message}
      </span>
    </div>
  );
}