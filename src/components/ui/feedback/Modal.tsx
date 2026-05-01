// src/components/ui/Modal.tsx
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
  cancelText = 'Отмена',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div
        ref={modalRef}
        className={cn(
          'bg-white rounded-lg shadow-xl w-full max-w-md mx-4',
          'animate-slide-up'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {title && (
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1"
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        )}
        
        <div className="px-6 py-4 text-gray-700">
          {children}
        </div>
        
        {(onConfirm || cancelText) && (
          <div className="border-t px-6 py-4 flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel || onClose}>
              {cancelText}
            </Button>
            {onConfirm && (
              <Button
                variant="primary"
                className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}
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