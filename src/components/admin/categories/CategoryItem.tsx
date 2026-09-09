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
    <Card className="p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        {category.iconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={category.iconUrl} alt={category.name} className="w-8 h-8 rounded-lg object-contain" />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-(--loom-cyan)/20 flex items-center justify-center text-(--loom-cyan) font-bold">
            {category.name[0]}
          </div>
        )}
        <span className="text-(--loom-white) font-medium">{category.name}</span>
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
          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </Card>
  );
}