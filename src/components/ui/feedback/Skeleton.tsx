import { GlitchLine } from '@/components/common/GlitchLine';
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
    <div className="glitch-border overflow-hidden rounded-xl bg-(--loom-white)/5 p-4">
      <Skeleton className="mb-3 h-32 w-full" variant="glitch" />
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
    <div className="glitch-border space-y-4 rounded-xl bg-(--loom-black) p-6">
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
    <div className="h-46 w-50 shrink-0 snap-start overflow-hidden rounded-xl">
      <Skeleton className="h-full w-full" variant="glitch" />
    </div>
  );
}

// ContinueQuizSkeleton — для отмены
export function ContinueQuizSkeleton() {
  return (
    <div className="h-46 w-full overflow-hidden rounded-xl">
      <Skeleton className="h-full w-full" variant="glitch" />
    </div>
  );
}

// CategorySkeleton
export function CategorySkeleton() {
  return (
    <div className="glitch-border relative overflow-hidden rounded-2xl bg-(--loom-white)/5 p-5">
      <div className="pointer-events-none absolute inset-0">
        <div className="glitch-scanline-gradient animate-scanline absolute right-0 left-0 mx-auto h-0.75 w-full opacity-50 blur-[1px]" />
      </div>
      <div className="relative z-10 flex items-center justify-between">
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
    <div className="glitch-border flex min-h-39 flex-row gap-3 overflow-hidden rounded-xl bg-(--loom-white)/5 p-4">
      {/* Левая часть */}
      <div className="flex h-full min-w-0 flex-1 flex-col gap-2">
        {/* 1. Иконка + Заголовок + Описание */}
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col space-y-1.5">
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
          </div>
        </div>

        {/* 2. Теги в одну строку: Вопросы • Категория • Уровень */}
        <div className="mt-1 flex flex-wrap justify-center gap-2">
          <Skeleton className="h-4 w-14 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
        </div>

        {/* 3. Отдельная строка: Попытки (слева) + Результат (справа) */}
        <div className="mt-1 flex flex-wrap justify-center gap-4">
          <Skeleton className="h-4 w-24 rounded-md" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-10 animate-pulse rounded-md bg-(--loom-yellow)/10" />
          </div>
        </div>

        {/* 4. Кнопка */}
        <div className="mt-auto pt-2">
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>

      {/* Правая часть (разделитель + звезда) */}
      <div className="flex h-full w-12 shrink-0 flex-col items-center justify-center border-l border-(--loom-white)/10 pl-3">
        <Skeleton className="h-7 w-7 rounded-full" variant="glitch" />
      </div>
    </div>
  );
}

// AdminQuizRowSkeleton
export function AdminQuizRowSkeleton() {
  return (
    <div className="glitch-border flex flex-col justify-between gap-3 rounded-xl bg-(--loom-white)/5 p-4 sm:flex-row sm:items-center">
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
    <div className="flex min-h-screen flex-col items-center overflow-hidden bg-(--loom-black) pt-16">
      {/* Header */}
      <div className="mb-6 w-full max-w-2xl px-4">
        {/* Quiz title */}
        <div className="mb-2 flex items-center justify-center">
          <Skeleton className="h-15 w-65 rounded-xl" variant="glitch" />
        </div>

        {/* Progress */}
        <div className="mb-2 flex items-center gap-4 text-sm">
          <Skeleton className="h-4 w-24 rounded-md bg-(--loom-white)/5" />
          <Skeleton className="h-1 flex-1 rounded-full bg-(--loom-white)/10" />
          <Skeleton className="h-4 w-10 rounded-md bg-(--loom-white)/5" />
        </div>
      </div>

      {/* Question & Options */}
      <div className="w-full max-w-2xl flex-1 px-4">
        <div className="space-y-4">
          {/* Question text */}
          <div className="flex h-28 items-center justify-center overflow-hidden">
            <Skeleton className="h-17.5 w-70 rounded-xl" variant="glitch" />
          </div>

          {/* Options */}
          <div className="mx-auto flex w-full flex-col gap-4 pb-28">
            {['A', 'B', 'C', 'D'].map((letter) => (
              <div
                key={letter}
                className="flex h-15.5 w-full items-stretch overflow-hidden rounded-xl border border-(--loom-white)/10 bg-(--loom-white)/5"
              >
                {/* Letter */}
                <div className="flex w-11 shrink-0 items-center justify-center border-r border-(--loom-white)/10">
                  <Skeleton className="h-5 w-5 rounded-md bg-(--loom-white)/10" />
                </div>

                {/* Text */}
                <div className="flex flex-1 items-center px-4">
                  <Skeleton className="h-4 w-[70%] rounded-md bg-(--loom-white)/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="fixed right-0 bottom-0 left-0 z-50 flex justify-center border-t border-(--loom-white)/10 bg-(--loom-black)/90 py-4 backdrop-blur-sm">
        <Skeleton className="h-12 min-w-42 rounded-xl" variant="glitch" />
      </div>
    </div>
  );
}

///SkeletonHeader
export function SkeletonHeader() {
  return (
    <header
      className="sticky top-0 z-50 flex h-12 w-full items-center px-4 backdrop-blur-sm"
      style={{
        backgroundColor: 'var(--nav-bg)',
      }}
    >
      <Skeleton className="h-6 w-24 rounded-md" />
      <GlitchLine />
    </header>
  );
}
