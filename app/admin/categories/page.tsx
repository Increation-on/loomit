/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useToast } from '@/components/ui/feedback/ToastContainer';
import { Skeleton } from '@/components/ui/feedback/Skeleton';
import { BackLink } from '@/components/navigation/BackLink';
import { CategoryForm } from '@/components/admin/categories/CategoryForm';
import { CategoryList } from '@/components/admin/categories/CategoryList';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
} from '@/store/api/categoryApi';

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const { success, error: showError } = useToast();

  const handleAddCategory = async (name: string, iconFile: File | null) => {
    try {
      let iconUrl: string | null = null;

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

      await createCategory({ name, iconUrl }).unwrap();
      success('Категория добавлена');
    } catch (err: any) {
      if (err.status === 409) {
        showError('Категория с таким названием уже существует');
      } else {
        showError(err.data?.error || err.message || 'Ошибка при добавлении');
      }
    }
  };

  if (isLoading) {
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

      <h1 className="text-2xl font-bold text-(--loom-white) mb-6">
        Управление категориями
      </h1>

      <CategoryForm onAdd={handleAddCategory} isLoading={isCreating} />
      <CategoryList categories={categories} />
    </div>
  );
}