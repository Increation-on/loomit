'use client';

import { Button } from '@/components/ui/core/Button';
import { Card } from '@/components/ui/core/Card';
import { Pencil, Trash2 } from 'lucide-react';

interface CategoryItemProps {
  category: {
    id: string;
    name: string;
    iconUrl?: string | null;
  };
  onEdit: (category: any) => void;
  onDelete: (id: string) => void;
}

export function CategoryItem({ category, onEdit, onDelete }: CategoryItemProps) {
  return (
    <Card className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        {category.iconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={category.iconUrl}
            alt={category.name}
            className="h-8 w-8 rounded-lg object-contain"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--loom-cyan)/20 font-bold text-(--loom-cyan)">
            {category.name[0]}
          </div>
        )}
        <span className="font-medium text-(--loom-white)">{category.name}</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => onEdit(category)}
          className="h-8 w-8"
        >
          <Pencil size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(category.id)}
          className="h-8 w-8 text-red-400 hover:bg-red-400/10 hover:text-red-300"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </Card>
  );
}
