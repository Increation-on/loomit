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
      <div className="space-y-1 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-(--loom-white)/80"
          >
            {label}
          </label>
        )}
        
        <div className="relative glitch-border rounded-xl bg-(--loom-white)/5 w-full">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-(--loom-white)/40">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            className={cn(
              'w-full bg-transparent text-(--loom-white) rounded-xl px-4 py-3',
              'placeholder:text-(--loom-white)/30',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              'focus:outline-none',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-red-500 focus:border-red-500',
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-(--loom-white)/40">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-500"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };