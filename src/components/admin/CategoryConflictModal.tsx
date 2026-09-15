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
      <div className="bg-(--loom-black) glitch-border rounded-xl shadow-[0_0_30px_rgba(0,204,204,0.15)] w-full max-w-md mx-4 p-6">
        <h2 className="text-xl font-bold text-(--loom-white) mb-2">
          Категория не найдена
        </h2>

        <p className="text-(--loom-white)/70 text-sm mb-4">
          Категория <span className="text-(--loom-white)/40 line-through">«{categoryName}»</span> отсутствует.
        </p>

        {similarCategories.length > 0 ? (
          <div>
            <p className="text-xs text-(--loom-cyan)/70 uppercase tracking-wider mb-2 font-mono">
              ↓ Выберите существующую
            </p>
            <div className="space-y-2">
              {similarCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelect(cat.id)}
                  disabled={isLoading}
                  className="w-full text-left px-4 py-3 rounded-lg bg-(--loom-cyan)/10 border border-(--loom-cyan)/30 hover:border-(--loom-cyan) hover:bg-(--loom-cyan)/20 text-(--loom-white) font-medium transition-all disabled:opacity-50 flex items-center justify-between group"
                >
                  <span>{cat.name}</span>
                  <Check
                    size={16}
                    className="text-(--loom-cyan) opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-(--loom-white)/50 text-sm">
            Похожих категорий не найдено.
          </p>
        )}

        {similarCategories.length > 0 && (
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-(--loom-cyan)/30 to-transparent" />
            <span className="text-xs text-(--loom-white)/40 uppercase tracking-widest font-mono">
              или
            </span>
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-(--loom-cyan)/30 to-transparent" />
          </div>
        )}

        <div className="flex flex-col gap-2 mt-6">
          <Button
            variant="glitch"
            onClick={onCreate}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Создание...' : (
              <span className="flex items-center justify-center gap-2">
                <span>Создать</span>
                <span className="text-(--loom-magenta) font-bold">«{categoryName}»</span>
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full"
          >
            Отмена
          </Button>
        </div>
      </div>
    </div>
  );
}