// src/components/ui/feedback/Skeleton.tsx
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'glitch';
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl',
        variant === 'default' && 'bg-(--loom-white)/5',
        variant === 'glitch' && 'bg-(--loom-cyan)/10',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite]',
        'before:bg-linear-to-r before:from-transparent before:via-(--loom-white)/10 before:to-transparent',
        className
      )}
    />
  );
}

// QuizCardSkeleton
export function QuizCardSkeleton() {
  return (
    <div className="glitch-border rounded-xl bg-(--loom-white)/5 p-4 overflow-hidden">
      <Skeleton className="h-32 w-full mb-3" variant="glitch" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

// QuestionSkeleton
export function QuestionSkeleton() {
  return (
    <div className="glitch-border rounded-xl bg-(--loom-black) p-6 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-full" />
      </div>
      <div className="space-y-3 pt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TryItSkeleton() {
  return (
    <div className="w-50 h-46 shrink-0 snap-start rounded-xl overflow-hidden">
      <Skeleton className="w-full h-full" variant="glitch" />
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="bg-(--loom-white)/5 rounded-2xl p-5 glitch-border relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 right-0 mx-auto w-full h-0.75 glitch-scanline-gradient opacity-50 blur-[1px] animate-scanline" />
      </div>
      <div className="flex justify-between items-center relative z-10">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}

export function CatalogCardSkeleton() {
  return (
    <div className="p-4 bg-(--loom-white)/5 rounded-xl glitch-border">
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-2 w-2 rounded-full" />
        </div>
      </div>
    </div>
  );
}