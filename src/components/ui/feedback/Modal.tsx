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
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        ref={modalRef}
        className={cn(
          'glitch-border mx-4 w-full max-w-md rounded-xl bg-(--loom-black) shadow-[0_0_30px_rgba(0,204,204,0.15)]',
          'animate-slide-up'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          {title ? (
            <h2 id="modal-title" className="text-xl font-bold text-(--loom-white)">
              {title}
            </h2>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="p-1 text-2xl leading-none text-(--loom-yellow) transition-colors hover:text-(--loom-cyan)"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-3 text-(--loom-white)/70">{children}</div>

        {/* Кнопки — только если есть onConfirm или cancelText */}
        {(onConfirm || cancelText) && (
          <div className="flex flex-wrap items-center justify-end gap-2 px-6 pt-2 pb-5">
            {cancelText && (
              <Button variant="secondary" onClick={onCancel || onClose} className="min-w-20 flex-1">
                {cancelText}
              </Button>
            )}
            {onConfirm && (
              <Button
                variant="glitch"
                className={cn(
                  'min-w-20 flex-1',
                  variant === 'danger' && 'border-red-600 bg-red-600 text-white'
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
