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

export function CategoryList({ 
  limit = 4, 
  showAllLink = true,
  className 
}: CategoryListProps) {
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
    <div className={cn('space-y-3 relative overflow-hidden', className)}>
       <span className="flex mt-1 text-lg">Категории</span>
      {displayed.map((cat: any) => (
        <div
          key={cat.id}
          onClick={() => router.push(`/catalog?category=${cat.id}`)}
          className="bg-(--loom-white)/5 rounded-2xl p-5 cursor-pointer flex justify-between items-center relative glitch-border hover:bg-(--loom-white)/10 transition-colors overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-0 right-0 mx-auto w-full h-0.75 glitch-scanline-gradient opacity-50 blur-[1px] animate-scanline" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-(--loom-magenta)">{cat.name}</h3>
            <p className="text-sm text-(--loom-white)/60">
              {cat._count?.quizzes || 0} {pluralize(cat._count?.quizzes || 0, 'квиз', 'квиза', 'квизов')}
            </p>
          </div>
          <div>
            {cat.iconUrl ? (
              <img src={cat.iconUrl} alt={cat.name} className="w-12 h-12 rounded-full object-contain" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-(--loom-cyan)/20 flex items-center justify-center text-(--loom-cyan) font-bold">
                {cat.name[0]}
              </div>
            )}
          </div>
        </div>
      ))}

      {showAllLink && categories.length > limit && (
        <div className="mt-2 flex justify-end">
          <Link href="/catalog" className="text-sm text-(--loom-yellow)">
            <span className="flex mt-1">Все категории<ChevronRight size={20} /></span>
          </Link>
        </div>
      )}
    </div>
  );
}
