'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/core/Button';
import { Input } from '@/components/ui/core/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/core/Card';
import { Trash2, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/feedback/ToastContainer';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
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

  const addCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      if (res.ok) {
        success('Категория добавлена');
        setNewCategoryName('');
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
      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Название категории"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="flex-1"
        />
        <Button variant="glitch" onClick={addCategory} disabled={!newCategoryName.trim()}>
          <Plus size={16} className="mr-2" />
          Добавить
        </Button>
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
              <span className="text-(--loom-white) font-medium">{cat.name}</span>
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