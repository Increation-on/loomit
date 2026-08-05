'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../core/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel?: () => void;
  title?: string;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  variant?: 'default' | 'danger';
}

export function Modal({
  isOpen,
  onClose,
  onCancel,
  title,
  children,
  confirmText = 'Подтвердить',
  cancelText,
  onConfirm,
  variant = 'default',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        ref={modalRef}
        className={cn(
          'bg-(--loom-black) glitch-border rounded-xl shadow-[0_0_30px_rgba(0,204,204,0.15)] w-full max-w-md mx-4',
          'animate-slide-up'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        <div className="px-6 pt-5 pb-2 flex items-center justify-between">
          {title ? (
            <h2 id="modal-title" className="text-xl font-bold text-(--loom-white)">
              {title}
            </h2>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="text-(--loom-yellow) hover:text-(--loom-cyan) text-2xl leading-none p-1 transition-colors"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-3 text-(--loom-white)/70">
          {children}
        </div>

        {/* Кнопки — только если есть onConfirm или cancelText */}
        {(onConfirm || cancelText) && (
          <div className="px-6 pb-5 pt-2 flex flex-wrap items-center justify-end gap-2">
            {cancelText && (
              <Button variant="secondary" onClick={onCancel || onClose} className="flex-1 min-w-20">
                {cancelText}
              </Button>
            )}
            {onConfirm && (
              <Button
                variant="glitch"
                className={cn(
                  "flex-1 min-w-20",
                  variant === 'danger' && 'bg-red-600 text-white border-red-600'
                )}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}