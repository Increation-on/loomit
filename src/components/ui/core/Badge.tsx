// src/components/ui/core/Badge.tsx
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'cyan' | 'yellow' | 'purple' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-(--loom-white)/10 text-(--loom-white)',
  cyan: 'bg-(--loom-cyan)/20 text-(--loom-cyan)',
  yellow: 'bg-(--loom-yellow)/20 text-(--loom-yellow)',
  purple: 'bg-(--loom-purple)/20 text-(--loom-purple)',
  outline: 'border border-(--loom-white)/20 text-(--loom-white)',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}