// src/components/ui/feedback/Toast.tsx
'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number | null;
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

export function Toast({ message, type, duration = 4000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Автоскрытие: таймер живёт, пока тост видим
  useEffect(() => {
    if (!isVisible || !duration) return;
    const timer = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration, isVisible]);

  // Удаление после анимации исчезновения
  useEffect(() => {
    if (isVisible) return;
    const timer = setTimeout(onClose, 300);
    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  return (
    <div
      role={type === 'error' || type === 'warning' ? 'alert' : 'status'}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-4 py-3 shadow-lg',
        'glitch-border bg-(--loom-black)',
        'animate-slide-up transition-all duration-300',
        !isVisible && 'translate-y-2 opacity-0'
      )}
    >
      <span className={cn('text-lg font-bold', colorMap[type])}>{iconMap[type]}</span>
      <span className="min-w-0 flex-1 wrap-break-word text-sm text-center text-(--loom-white) line-clamp-6">
        {message}
      </span>
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        aria-label="Закрыть уведомление"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-(--loom-white)/60 transition-colors hover:bg-white/10 hover:text-(--loom-white) focus-visible:outline-2 focus-visible:outline-(--loom-cyan)"
      >
        ×
      </button>
    </div>
  );
}
