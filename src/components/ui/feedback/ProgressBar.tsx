// src/components/ui/ProgressBar.tsx
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  showPercentage?: boolean;
}

export function ProgressBar({ current, total, className, showPercentage = false }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">
          Вопрос {current} из {total}
        </span>
        {showPercentage && (
          <span className="text-sm text-gray-600">{Math.round(percentage)}%</span>
        )}
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>
    </div>
  );
}
