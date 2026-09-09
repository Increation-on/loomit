/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/feedback/ToastContainer';
import { Skeleton } from '@/components/ui/feedback/Skeleton';
import { BackLink } from '@/components/navigation/BackLink';
import { CategoryForm } from '@/components/admin/categories/CategoryForm';
import { CategoryList } from '@/components/admin/categories/CategoryList';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
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

  const handleAddCategory = async (name: string, iconFile: File | null) => {
    setIsCreating(true);
    try {
      let iconUrl = null;
      if (iconFile) {
        const formData = new FormData();
        formData.append('file', iconFile);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) throw new Error('Ошибка загрузки иконки');
        const data = await res.json();
        iconUrl = data.url;
      }

      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, iconUrl }),
      });

      if (res.ok) {
        success('Категория добавлена');
        loadCategories();
      } else {
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

  if (loading) {
    return (
      <div className="p-4 max-w-2xl mx-auto pb-24">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="flex gap-3 mb-4">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto pb-24">
      <div className="mt-2 mb-2">
        <BackLink fallback="/admin" className="mb-4" />
      </div>

      <h1 className="text-2xl font-bold text-(--loom-white) mb-6">Управление категориями</h1>

      <CategoryForm onAdd={handleAddCategory} isLoading={isCreating} />
      <CategoryList categories={categories} onRefresh={loadCategories} />
    </div>
  );
}