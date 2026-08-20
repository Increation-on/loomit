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
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:content-[""]',
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

// TryItSkeleton
export function TryItSkeleton() {
  return (
    <div className="w-50 h-46 shrink-0 snap-start rounded-xl overflow-hidden">
      <Skeleton className="w-full h-full" variant="glitch" />
    </div>
  );
}

// CategorySkeleton
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

// CatalogCardSkeleton
export function CatalogCardSkeleton() {
  return (
    <div className="overflow-hidden flex flex-row p-4 gap-3 min-h-39 bg-(--loom-white)/5 rounded-xl glitch-border">
      {/* Левая часть */}
      <div className="flex-1 flex flex-col h-full min-w-0 gap-2">P
        
        {/* 1. Иконка + Заголовок + Описание */}
        <div className="flex items-start gap-3">
          <Skeleton className="w-12 h-12 rounded-full shrink-0" />
          <div className="flex flex-col min-w-0 space-y-1.5 flex-1">
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
          </div>
        </div>

        {/* 2. Теги в одну строку: Вопросы • Категория • Уровень */}
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          <Skeleton className="h-4 w-14 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
        </div>

        {/* 3. Отдельная строка: Попытки (слева) + Результат (справа) */}
        <div className="flex flex-wrap justify-center gap-4 mt-1">
          <Skeleton className="h-4 w-24 rounded-md" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-10 bg-(--loom-yellow)/10 rounded-md animate-pulse" />
          </div>
        </div>

        {/* 4. Кнопка */}
        <div className="mt-auto pt-2">
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>

      </div>

      {/* Правая часть (разделитель + звезда) */}
      <div className="flex flex-col items-center justify-center shrink-0 w-12 h-full pl-3 border-l border-(--loom-white)/10">
        <Skeleton className="w-7 h-7 rounded-full" variant="glitch" />
      </div>
    </div>
  );
}

// AdminQuizRowSkeleton
export function AdminQuizRowSkeleton() {
  return (
    <div className="p-4 bg-(--loom-white)/5 rounded-xl glitch-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function QuizSkeleton() {
  return (
    <div className="min-h-screen bg-(--loom-black) flex flex-col items-center pt-16 overflow-hidden">
      
      {/* Header */}
      <div className="w-full max-w-2xl px-4 mb-6">
        
        {/* Quiz title */}
        <div className="flex items-center justify-center mb-2">
          <Skeleton
            className="h-15 w-65 rounded-xl"
            variant="glitch"
          />
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4 text-sm mb-2">
          <Skeleton className="h-4 w-24 rounded-md bg-(--loom-white)/5" />
          <Skeleton className="flex-1 h-1 rounded-full bg-(--loom-white)/10" />
          <Skeleton className="h-4 w-10 rounded-md bg-(--loom-white)/5" />
        </div>
      </div>

      {/* Question & Options */}
      <div className="w-full max-w-2xl px-4 flex-1">
        <div className="space-y-4">
          {/* Question text */}
          <div className="h-28 flex items-center justify-center overflow-hidden">
            <Skeleton
              className="h-17.5 w-70 rounded-xl"
              variant="glitch"
            />
          </div>

          {/* Options */}
          <div className="flex flex-col gap-4 w-full mx-auto pb-28">
            {['A', 'B', 'C', 'D'].map((letter) => (
              <div
                key={letter}
                className="
                  h-15.5
                  w-full
                  flex
                  items-stretch
                  overflow-hidden
                  rounded-xl
                  border
                  border-(--loom-white)/10
                  bg-(--loom-white)/5
                "
              >
                {/* Letter */}
                <div
                  className="
                    w-11
                    shrink-0
                    flex
                    items-center
                    justify-center
                    border-r
                    border-(--loom-white)/10
                  "
                >
                  <Skeleton className="h-5 w-5 rounded-md bg-(--loom-white)/10" />
                </div>

                {/* Text */}
                <div className="flex-1 px-4 flex items-center">
                  <Skeleton className="h-4 w-[70%] rounded-md bg-(--loom-white)/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          bg-(--loom-black)/90
          backdrop-blur-sm
          border-t
          border-(--loom-white)/10
          flex
          justify-center
          z-50
          py-4
        "
      >
        <Skeleton
          className="h-12 min-w-42 rounded-xl"
          variant="glitch"
        />
      </div>
    </div>
  );
}
