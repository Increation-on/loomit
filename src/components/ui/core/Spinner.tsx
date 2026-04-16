// src/components/ui/Spinner.tsx
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-solid border-gray-300 border-t-blue-600',
        sizeClasses[size],
        className
      )}
    />
  );
}

export function Loader({ className }: { className?: string }) {
  return (
    <div className={cn('flex justify-center items-center py-8', className)}>
      <Spinner size="lg" />
    </div>
  );
}