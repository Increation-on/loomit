// src/components/ui/core/Button.tsx

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        // Основная жёлтая кнопка с глитч-рамкой
        glitch: 'bg-(--loom-yellow) text-black hover:opacity-90 glitch-border',
        // Вторичная — для кнопок «Назад» и т.д.
        secondary: 'bg-(--loom-white)/10 text-(--loom-white) hover:bg-(--loom-white)/20',
        // Тёмная кнопка (например, для админки)
        dark: 'bg-(--loom-purple) text-white hover:opacity-90',
        // Без фона, с глитч-рамкой
        outline: 'border border-(--loom-yellow) text-(--loom-yellow) hover:bg-(--loom-yellow)/10',
        // Совсем без фона
        ghost: 'bg-transparent text-(--loom-white) hover:bg-(--loom-white)/10',
        // 👇 НОВЫЙ ВАРИАНТ
        danger: 'bg-red-500 text-white hover:bg-red-600 transition-colors',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-12 px-4 py-2',
        lg: 'h-14 px-6 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'glitch',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
