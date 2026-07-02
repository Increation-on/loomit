'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/core/Button';
import { Input } from '@/components/ui/core/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/core/Card';
import { Trash2, Plus, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/feedback/ToastContainer';
import { cn } from '@/lib/utils';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { success, error: showError } = useToast();

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    const reader = new FileReader();
    reader.onload = () => setIconPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const uploadIcon = async (): Promise<string | null> => {
    if (!iconFile) return null;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', iconFile);
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
    try {
      const iconUrl = await uploadIcon();
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
        showError('Ошибка при добавлении');
      }
    } catch (err) {
      showError('Ошибка сети');
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

      {/* Добавление категории */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex gap-3">
          <Input
            placeholder="Название категории"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-1"
          />
          <Button variant="glitch" onClick={addCategory} disabled={!newCategoryName.trim() || isUploading}>
            <Plus size={16} className="mr-2" />
            {isUploading ? 'Загрузка...' : 'Добавить'}
          </Button>
        </div>

        {/* Загрузка иконки */}
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteCategory(cat.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
              >
                <Trash2 size={16} />
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}