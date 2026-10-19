/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/feedback/Modal';
import { Input } from '@/components/ui/core/Input';
import { Upload, X } from 'lucide-react';

interface CategoryEditModalProps {
  isOpen: boolean;
  category: any | null;
  onClose: () => void;
  onSave: (
    id: string,
    name: string,
    iconUrl: string | null,
    iconFile: File | null
  ) => Promise<void>;
  isSaving?: boolean;
}

export function CategoryEditModal({
  isOpen,
  category,
  onClose,
  onSave,
  isSaving = false,
}: CategoryEditModalProps) {
  const [name, setName] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [removeIcon, setRemoveIcon] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIconFile(null);
      setIconPreview(null);
      setRemoveIcon(false);
    }
  }, [category]);

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

  const handleSave = () => {
    if (!category || !name.trim()) return;
    onSave(category.id, name.trim(), null, iconFile);
  };

  const getCurrentIcon = () => {
    if (removeIcon) return null;
    if (iconPreview) return iconPreview;
    if (category?.iconUrl) return category.iconUrl;
    return null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Редактировать категорию"
      confirmText={isSaving ? 'Сохранение...' : 'Сохранить'}
      cancelText="Отмена"
      onConfirm={handleSave}
      onCancel={onClose}
    >
      <div className="space-y-4">
        <Input
          placeholder="Название категории"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex items-center gap-4">
          {getCurrentIcon() ? (
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-(--loom-white)/10 bg-(--loom-white)/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getCurrentIcon()!} alt="Превью" className="h-full w-full object-contain" />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-(--loom-white)/10 bg-(--loom-white)/5 text-(--loom-white)/40">
              ?
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-(--loom-white)/60 transition-colors hover:text-(--loom-white)">
              <Upload size={14} />
              {iconFile ? 'Заменить' : 'Загрузить'}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            <button
              onClick={() => {
                setRemoveIcon(!removeIcon);
                if (!removeIcon) {
                  setIconFile(null);
                  setIconPreview(null);
                }
              }}
              className={cn(
                'flex items-center gap-1 text-sm transition-colors',
                removeIcon
                  ? 'text-red-400 hover:text-red-300'
                  : 'text-(--loom-white)/40 hover:text-(--loom-white)'
              )}
            >
              {removeIcon ? <X size={14} /> : 'Убрать иконку'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
