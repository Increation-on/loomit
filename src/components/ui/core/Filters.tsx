'use client';

import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Skeleton } from '../feedback/Skeleton';

interface FiltersProps {
  // Категории
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  disableAllOption?: boolean; // убираем «Все» для категорий

  // Уровни
  levelFilter?: string;
  setLevelFilter?: (value: any) => void;
  includeLevelAll?: boolean; // ✅ добавляем «Все» для уровней

  // Сортировка
  sortBy?: string;
  setSortBy?: (value: string) => void;
  showSort?: boolean;
  
  className?: string;
}

export function Filters({
  categoryFilter,
  setCategoryFilter,
  disableAllOption = false,
  levelFilter,
  setLevelFilter,
  includeLevelAll = true,
  sortBy,
  setSortBy,
  showSort = true,
  className,
}: FiltersProps) {
  const { data: categories, isLoading } = useGetCategoriesQuery({});

  const sortOptions = [
    { value: 'popular', label: 'Популярные' },
    { value: 'newest', label: 'Новые' },
    { value: 'alphabetical', label: 'По алфавиту' },
  ];

  const categoryOptions = [
    ...(!disableAllOption ? [{ value: 'all', label: 'Все' }] : []),
    ...(categories?.map((cat: any) => ({ value: cat.id, label: cat.name })) || []),
  ];

  const levelOptions = [
    ...(includeLevelAll ? [{ value: 'all', label: 'Все' }] : []),
    { value: 'JUNIOR', label: 'Junior' },
    { value: 'MIDDLE', label: 'Middle' },
    { value: 'SENIOR', label: 'Senior' },
  ];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Категории */}
      <div>
        <span className="text-sm text-(--loom-white)/60 block mb-2">Категория</span>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full shrink-0" />
              ))}
            </>
          ) : (
            categoryOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setCategoryFilter(option.value)}
                className={cn(
                  'px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap',
                  categoryFilter === option.value
                    ? 'bg-(--loom-cyan)/20 text-(--loom-cyan)'
                    : 'bg-(--loom-white)/5 text-(--loom-white)/60 hover:bg-(--loom-white)/10'
                )}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Уровни (только если передан levelFilter) */}
      {levelFilter !== undefined && setLevelFilter !== undefined && (
        <div>
          <span className="text-sm text-(--loom-white)/60 block mb-2">Уровень</span>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {levelOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setLevelFilter(option.value)}
                className={cn(
                  'px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap',
                  levelFilter === option.value
                    ? 'bg-(--loom-cyan)/20 text-(--loom-cyan)'
                    : 'bg-(--loom-white)/5 text-(--loom-white)/60 hover:bg-(--loom-white)/10'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Сортировка (только если showSort = true) */}
      {showSort && sortBy !== undefined && setSortBy !== undefined && (
        <div>
          <span className="text-sm text-(--loom-white)/60 block mb-2">Сортировка</span>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant={sortBy === option.value ? 'glitch' : 'secondary'}
                size="sm"
                onClick={() => setSortBy(option.value)}
                className="px-4 py-2 text-sm shrink-0"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
