'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/core/Button';
import { Input } from '@/components/ui/core/Input';
import { Plus, Upload } from 'lucide-react';

interface CategoryFormProps {
  onAdd: (name: string, iconFile: File | null) => Promise<void>;
  isLoading?: boolean;
}

export function CategoryForm({ onAdd, isLoading = false }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setIconFile(file);
      setIconPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await onAdd(name.trim(), iconFile);
    setName('');
    setIconFile(null);
    setIconPreview(null);
  };

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex gap-3">
        <Input
          placeholder="Название категории"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
        />
        <Button variant="glitch" onClick={handleSubmit} disabled={!name.trim() || isLoading}>
          {isLoading ? 'Создание...' : <><Plus size={16} className="mr-2" /> Добавить</>}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {iconPreview ? (
          <div className="w-12 h-12 rounded-lg border border-(--loom-white)/10 overflow-hidden bg-(--loom-white)/5 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={iconPreview} alt="Превью" className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg border border-(--loom-white)/10 bg-(--loom-white)/5 flex items-center justify-center text-(--loom-white)/40">
            ?
          </div>
        )}
        <label className="cursor-pointer text-sm text-(--loom-white)/60 hover:text-(--loom-white) transition-colors flex items-center gap-2">
          <Upload size={16} />
          {iconFile ? 'Изменить иконку' : 'Загрузить иконку'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {iconFile && (
          <button
            onClick={() => {
              setIconFile(null);
              setIconPreview(null);
            }}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Убрать
          </button>
        )}
      </div>
    </div>
  );
}