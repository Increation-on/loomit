'use client';

import { useState } from 'react';
import { CategoryItem } from './CategoryItem';
import { CategoryEditModal } from './CategoryEditModal';
import { Modal } from '@/components/ui/feedback/Modal';
import { useToast } from '@/components/ui/feedback/ToastContainer';
import {
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '@/store/api/categoryApi';

interface CategoryListProps {
  categories: any[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const { success, error: showError } = useToast();

  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async () => {
    if (!deleteCategoryId) return;

    try {
      await deleteCategory(deleteCategoryId).unwrap();
      success('Категория удалена');
    } catch (err: any) {
      showError(err.data?.error || 'Ошибка при удалении');
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteCategoryId(null);
    }
  };

  const handleEditSave = async (
    id: string,
    name: string,
    iconUrl: string | null,
    iconFile: File | null
  ) => {
    try {
      let finalIconUrl = iconUrl;

      if (iconFile) {
        const formData = new FormData();
        formData.append('file', iconFile);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) throw new Error('Ошибка загрузки иконки');
        const data = await res.json();
        finalIconUrl = data.url;
      }

      await updateCategory({ id, name, iconUrl: finalIconUrl }).unwrap();
      success('Категория обновлена');
      setIsEditModalOpen(false);
      setEditingCategory(null);
    } catch (err: any) {
      showError(err.data?.error || err.message || 'Ошибка обновления');
    }
  };

  if (categories.length === 0) {
    return (
      <p className="text-(--loom-white)/60 text-center py-10">
        Пока нет категорий. Создайте первую!
      </p>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {categories.map((cat) => (
          <CategoryItem
            key={cat.id}
            category={cat}
            onEdit={(category) => {
              setEditingCategory(category);
              setIsEditModalOpen(true);
            }}
            onDelete={(id) => {
              setDeleteCategoryId(id);
              setIsDeleteModalOpen(true);
            }}
          />
        ))}
      </div>

      <CategoryEditModal
        isOpen={isEditModalOpen}
        category={editingCategory}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleEditSave}
        isSaving={isUpdating}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteCategoryId(null);
        }}
        title="Удалить категорию?"
        confirmText={isDeleting ? 'Удаление...' : 'Удалить'}
        cancelText="Отмена"
        onConfirm={handleDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeleteCategoryId(null);
        }}
      >
        <p className="text-(--loom-white)/70">
          Вы уверены, что хотите удалить категорию?
          <br />
          Это действие нельзя отменить.
        </p>
      </Modal>
    </>
  );
}