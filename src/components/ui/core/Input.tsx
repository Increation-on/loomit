'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, leftIcon, rightIcon, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-(--loom-white)/80">
            {label}
          </label>
        )}

        <div className="glitch-border relative w-full rounded-xl bg-(--loom-white)/5">
          {leftIcon && (
            <div className="absolute top-1/2 left-3 -translate-y-1/2 text-(--loom-white)/40">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            className={cn(
              'w-full rounded-xl bg-transparent px-4 py-3 text-(--loom-white)',
              'placeholder:text-(--loom-white)/30',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              'focus:outline-none',
              'transition-all duration-200',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500 focus:border-red-500',
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-(--loom-white)/40">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
