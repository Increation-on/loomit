'use client';

import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface FiltersProps {
  // Категории
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  
  // Уровни
  levelFilter: string;
  setLevelFilter: (value: 'all' | 'JUNIOR' | 'MIDDLE' | 'SENIOR') => void;
  
  // Сортировка (опционально)
  sortBy?: string;
  setSortBy?: (value: string) => void;
  showSort?: boolean;
  
  className?: string;
}

export function Filters({
  categoryFilter,
  setCategoryFilter,
  levelFilter,
  setLevelFilter,
  sortBy,
  setSortBy,
  showSort = true,
  className,
}: FiltersProps) {
  const { data: categories, isLoading } = useGetCategoriesQuery({});

  const levelOptions = [
  { value: 'all', label: 'Все' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'MIDDLE', label: 'Middle' },
  { value: 'SENIOR', label: 'Senior' },
] as const;

  const sortOptions = [
    { value: 'popular', label: 'Популярные' },
    { value: 'newest', label: 'Новые' },
    { value: 'alphabetical', label: 'По алфавиту' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'Все' },
    ...(categories?.map((cat: any) => ({ value: cat.id, label: cat.name })) || []),
  ];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Категории */}
      <div>
        <span className="text-sm text-(--loom-white)/60 block mb-2">Категории</span>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-7 w-16 bg-(--loom-white)/5 rounded-full animate-pulse shrink-0" />
              ))}
            </>
          ) : (
            categoryOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setCategoryFilter(option.value)}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-full transition-colors whitespace-nowrap',
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

      {/* Уровни */}
      <div>
        <span className="text-sm text-(--loom-white)/60 block mb-2">Уровень</span>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {levelOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setLevelFilter(option.value)}
              className={cn(
                'px-3 py-1.5 text-xs rounded-full transition-colors whitespace-nowrap',
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

      {/* Сортировка (только если showSort = true) */}
      {showSort && sortBy && setSortBy && (
        <div>
          <span className="text-sm text-(--loom-white)/60 block mb-2">Сортировка</span>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant={sortBy === option.value ? 'glitch' : 'secondary'}
                size="sm"
                onClick={() => setSortBy(option.value)}
                className="px-4 py-1.5 text-xs shrink-0"
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