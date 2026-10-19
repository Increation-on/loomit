'use client';

import { Button } from '@/components/ui/core/Button';
import { Check } from 'lucide-react';

interface SimilarCategory {
  id: string;
  name: string;
}

interface CategoryConflictModalProps {
  isOpen: boolean;
  categoryName: string;
  similarCategories: SimilarCategory[];
  onSelect: (categoryId: string) => void;
  onCreate: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CategoryConflictModal({
  isOpen,
  categoryName,
  similarCategories,
  onSelect,
  onCreate,
  onCancel,
  isLoading = false,
}: CategoryConflictModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glitch-border mx-4 w-full max-w-md rounded-xl bg-(--loom-black) p-6 shadow-[0_0_30px_rgba(0,204,204,0.15)]">
        <h2 className="mb-2 text-xl font-bold text-(--loom-white)">Категория не найдена</h2>

        <p className="mb-4 text-sm text-(--loom-white)/70">
          Категория <span className="text-(--loom-white)/40 line-through">«{categoryName}»</span>{' '}
          отсутствует.
        </p>

        {similarCategories.length > 0 ? (
          <div>
            <p className="mb-2 font-mono text-xs tracking-wider text-(--loom-cyan)/70 uppercase">
              ↓ Выберите существующую
            </p>
            <div className="space-y-2">
              {similarCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelect(cat.id)}
                  disabled={isLoading}
                  className="group flex w-full items-center justify-between rounded-lg border border-(--loom-cyan)/30 bg-(--loom-cyan)/10 px-4 py-3 text-left font-medium text-(--loom-white) transition-all hover:border-(--loom-cyan) hover:bg-(--loom-cyan)/20 disabled:opacity-50"
                >
                  <span>{cat.name}</span>
                  <Check
                    size={16}
                    className="text-(--loom-cyan) opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-(--loom-white)/50">Похожих категорий не найдено.</p>
        )}

        {similarCategories.length > 0 && (
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-(--loom-cyan)/30 to-transparent" />
            <span className="font-mono text-xs tracking-widest text-(--loom-white)/40 uppercase">
              или
            </span>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-(--loom-cyan)/30 to-transparent" />
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <Button variant="glitch" onClick={onCreate} disabled={isLoading} className="w-full">
            {isLoading ? (
              'Создание...'
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Создать</span>
                <span className="font-bold text-(--loom-magenta)">«{categoryName}»</span>
              </span>
            )}
          </Button>
          <Button variant="ghost" onClick={onCancel} disabled={isLoading} className="w-full">
            Отмена
          </Button>
        </div>
      </div>
    </div>
  );
}
