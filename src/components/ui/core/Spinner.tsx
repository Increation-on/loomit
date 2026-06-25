// src/components/ui/core/Spinner.tsx
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'yellow' | 'white';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-3',
};

const colorClasses = {
  cyan: 'border-(--loom-cyan) border-t-transparent',
  yellow: 'border-(--loom-yellow) border-t-transparent',
  white: 'border-(--loom-white) border-t-transparent',
};

export function Spinner({ 
  size = 'md', 
  color = 'cyan', 
  className 
}: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
}

export function Loader({ className, color = 'cyan' }: { className?: string; color?: 'cyan' | 'yellow' | 'white' }) {
  return (
    <div className={cn('flex justify-center items-center py-8', className)}>
      <Spinner size="lg" color={color} />
    </div>
  );
}