'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { Skeleton } from '@/components/ui/feedback/Skeleton';
import { EmptyState } from '@/components/ui/feedback/EmptyState';
import { cn, pluralize } from '@/lib/utils';

interface CategoryListProps {
  limit?: number;
  showAllLink?: boolean;
  className?: string;
}

export function CategoryList({ limit = 4, showAllLink = true, className }: CategoryListProps) {
  const router = useRouter();
  const { data: categories, isLoading } = useGetCategoriesQuery({});

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return <EmptyState title="Нет доступных категорий" />;
  }

  const displayed = limit ? categories.slice(0, limit) : categories;

  return (
    <div className={cn('relative space-y-3 overflow-hidden', className)}>
      <span className="mt-1 flex text-lg">Категории</span>
      {displayed.map((cat: any) => (
        <div
          key={cat.id}
          onClick={() => router.push(`/catalog?category=${cat.id}`)}
          className="glitch-border relative flex cursor-pointer items-center justify-between overflow-hidden rounded-2xl bg-(--loom-white)/5 p-5 transition-colors hover:bg-(--loom-white)/10"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="glitch-scanline-gradient animate-scanline absolute right-0 left-0 mx-auto h-0.75 w-full opacity-50 blur-[1px]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-(--loom-magenta)">{cat.name}</h3>
            <p className="text-sm text-(--loom-white)/60">
              {cat._count?.quizzes || 0}{' '}
              {pluralize(cat._count?.quizzes || 0, 'квиз', 'квиза', 'квизов')}
            </p>
          </div>
          <div>
            {cat.iconUrl ? (
              <img
                src={cat.iconUrl}
                alt={cat.name}
                className="h-12 w-12 rounded-full object-contain"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--loom-cyan)/20 font-bold text-(--loom-cyan)">
                {cat.name[0]}
              </div>
            )}
          </div>
        </div>
      ))}

      {showAllLink && categories.length > limit && (
        <div className="mt-2 flex justify-end">
          <Link href="/catalog" className="text-sm text-(--loom-yellow)">
            <span className="mt-1 flex">
              Все категории
              <ChevronRight size={20} />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
