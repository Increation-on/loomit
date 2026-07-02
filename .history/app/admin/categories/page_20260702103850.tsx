'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/core/Button';
import { Input } from '@/components/ui/core/Input';
import { Card } from '@/components/ui/core/Card';
import { Trash2, Plus, Pencil, Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/feedback/ToastContainer';
import { Modal } from '@/components/ui/feedback/Modal';
import { cn } from '@/lib/utils';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error: showError } = useToast();

  // Состояния для создания
  const [newCategoryName, setNewCategoryName] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Состояния для редактирования
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editIconFile, setEditIconFile] = useState<File | null>(null);
  const [editIconPreview, setEditIconPreview] = useState<string | null>(null);
  const [editRemoveIcon, setEditRemoveIcon] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (isEdit) {
        setEditIconFile(file);
        setEditIconPreview(reader.result as string);
      } else {
        setIconFile(file);
        setIconPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadIcon = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Ошибка загрузки иконки');
      const data = await res.json();
      return data.url;
    } catch (err) {
      console.error('Upload error:', err);
      showError('Не удалось загрузить иконку');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const addCategory = async () => {
  if (!newCategoryName.trim()) return;
  setIsCreating(true);
  try {
    let iconUrl = null;
    if (iconFile) {
      iconUrl = await uploadIcon(iconFile);
      if (!iconUrl) {
        showError('Не удалось загрузить иконку');
        return;
      }
    }
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newCategoryName.trim(),
        iconUrl,
      }),
    });
    if (res.ok) {
      success('Категория добавлена');
      setNewCategoryName('');
      setIconFile(null);
      setIconPreview(null);
      loadCategories();
    } else {
      // Если статус 409 — значит, категория уже существует
      if (res.status === 409) {
        showError('Категория с таким названием уже существует');
      } else {
        showError('Ошибка при добавлении');
      }
    }
  } catch (err) {
    showError('Ошибка сети');
  } finally {
    setIsCreating(false);
  }
};

  const deleteCategory = async (id: string) => {
    if (!confirm('Удалить категорию?')) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        success('Категория удалена');
        loadCategories();
      } else {
        showError('Ошибка при удалении');
      }
    } catch (err) {
      showError('Ошибка сети');
    }
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditIconFile(null);
    setEditIconPreview(null);
    setEditRemoveIcon(false);
    setIsEditModalOpen(true);
  };

  const saveEdit = async () => {
    if (!editingCategory || !editName.trim()) return;
    setIsUpdating(true);
    try {
      let iconUrl = editingCategory.iconUrl;
      if (editRemoveIcon) {
        iconUrl = null;
      } else if (editIconFile) {
        const newUrl = await uploadIcon(editIconFile);
        if (!newUrl) {
          showError('Не удалось загрузить иконку');
          return;
        }
        iconUrl = newUrl;
      }

      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCategory.id,
          name: editName.trim(),
          iconUrl,
        }),
      });
      if (res.ok) {
        success('Категория обновлена');
        setIsEditModalOpen(false);
        setEditingCategory(null);
        loadCategories();
      } else {
        showError('Ошибка при обновлении');
      }
    } catch (err) {
      showError('Ошибка сети');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="h-40 bg-(--loom-white)/5 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto pb-24">
      <h1 className="text-2xl font-bold text-(--loom-white) mb-6">Управление категориями</h1>

      {/* Форма добавления */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex gap-3">
          <Input
            placeholder="Название категории"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-1"
          />
          <Button variant="glitch" onClick={addCategory} disabled={!newCategoryName.trim() || isUploading || isCreating}>
            {isCreating ? 'Создание...' : <><Plus size={16} className="mr-2" /> Добавить</>}
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {iconPreview ? (
            <div className="w-12 h-12 rounded-lg border border-(--loom-white)/10 overflow-hidden bg-(--loom-white)/5 flex items-center justify-center">
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
              onChange={(e) => handleFileChange(e)}
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

      {/* Список категорий */}
      <div className="space-y-3">
        {categories.length === 0 ? (
          <p className="text-(--loom-white)/60 text-center py-10">
            Пока нет категорий. Создайте первую!
          </p>
        ) : (
          categories.map((cat) => (
            <Card key={cat.id} className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {cat.iconUrl ? (
                  <img src={cat.iconUrl} alt={cat.name} className="w-8 h-8 rounded-lg object-contain" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-(--loom-cyan)/20 flex items-center justify-center text-(--loom-cyan) font-bold">
                    {cat.name[0]}
                  </div>
                )}
                <span className="text-(--loom-white) font-medium">{cat.name}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => openEditModal(cat)}
                  className="h-8 w-8"
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteCategory(cat.id)}
                  className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Модалка редактирования */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Редактировать категорию"
        confirmText={isUpdating ? 'Сохранение...' : 'Сохранить'}
        cancelText="Отмена"
        onConfirm={saveEdit}
        onCancel={() => setIsEditModalOpen(false)}
      >
        <div className="space-y-4">
          <Input
            placeholder="Название категории"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <div className="flex items-center gap-4">
            {editRemoveIcon ? (
              <div className="w-12 h-12 rounded-lg border border-(--loom-white)/10 bg-(--loom-white)/5 flex items-center justify-center text-(--loom-white)/40">
                ?
              </div>
            ) : editIconPreview ? (
              <div className="w-12 h-12 rounded-lg border border-(--loom-white)/10 overflow-hidden bg-(--loom-white)/5 flex items-center justify-center">
                <img src={editIconPreview} alt="Превью" className="w-full h-full object-contain" />
              </div>
            ) : editingCategory?.iconUrl ? (
              <img src={editingCategory.iconUrl} alt="Иконка" className="w-12 h-12 rounded-lg object-contain" />
            ) : (
              <div className="w-12 h-12 rounded-lg border border-(--loom-white)/10 bg-(--loom-white)/5 flex items-center justify-center text-(--loom-white)/40">
                ?
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="cursor-pointer text-sm text-(--loom-white)/60 hover:text-(--loom-white) transition-colors flex items-center gap-2">
                <Upload size={14} />
                {editIconFile ? 'Заменить' : 'Загрузить'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, true)}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => {
                  setEditRemoveIcon(!editRemoveIcon);
                  if (!editRemoveIcon) {
                    setEditIconFile(null);
                    setEditIconPreview(null);
                  }
                }}
                className={cn(
                  'text-sm flex items-center gap-1 transition-colors',
                  editRemoveIcon ? 'text-red-400 hover:text-red-300' : 'text-(--loom-white)/40 hover:text-(--loom-white)'
                )}
              >
                {editRemoveIcon ? <X size={14} /> : 'Убрать иконку'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}