'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/core/Button';
import { Modal } from '@/components/ui/feedback/Modal';
import { useToast } from '@/components/ui/feedback/ToastContainer';
import { Upload, ClipboardPaste } from 'lucide-react';
import { CategoryConflictModal } from './CategoryConflictModal';
import { quizImportSchema } from '@/lib/validators/quizImport';
import { levenshtein, normalizeCategoryName, commonPrefixLength } from '@/lib/utils';
import { useCreateCategoryMutation, useGetCategoriesQuery } from '@/store/api/categoryApi';

interface ImportedQuiz {
  title: string;
  description?: string;
  categoryId: string;
  level: 'JUNIOR' | 'MIDDLE' | 'SENIOR';
  questions: {
    id: string;
    text: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
    explanation?: string;
  }[];
}

interface QuizImportBlockProps {
  onImport: (data: ImportedQuiz) => void;
}

export function QuizImportBlock({ onImport }: QuizImportBlockProps) {
  const { success, error: showError } = useToast();
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();

  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [conflict, setConflict] = useState<{
    isOpen: boolean;
    categoryName: string;
    similarCategories: { id: string; name: string }[];
    pendingData: any;
  }>({
    isOpen: false,
    categoryName: '',
    similarCategories: [],
    pendingData: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Вызывается, когда категория определена — передаём данные родителю
  const finalizeImport = (data: any, categoryId: string) => {
    const questions = data.questions.map((q: any) => ({
      id: crypto.randomUUID(),
      text: q.text,
      options: q.options,
      correctOptionId: q.correctOptionId,
      explanation: q.explanation || '',
    }));

    onImport({
      title: data.title,
      description: data.description,
      categoryId,
      level: data.level,
      questions,
    });

    success('Данные заполнены! Проверьте и сохраните.');
    setIsPasteModalOpen(false);
    setJsonText('');
    setConflict((prev) => ({ ...prev, isOpen: false }));
    setIsProcessing(false);
  };

  // Парсинг и валидация JSON
  const processImport = (jsonString: string) => {
    setIsProcessing(true);

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      showError('Не удалось прочитать JSON. Проверьте формат файла.');
      setIsProcessing(false);
      return;
    }

    const validated = quizImportSchema.safeParse(parsed);
    if (!validated.success) {
      showError(validated.error.issues.map((i) => i.message).join(', '));
      setIsProcessing(false);
      return;
    }

    const { categoryName, ...rest } = validated.data;
    const normalizedInput = normalizeCategoryName(categoryName);

    // 1. Точное совпадение
    const exact = categories.find(
      (c: any) => normalizeCategoryName(c.name) === normalizedInput
    );

    if (exact) {
      finalizeImport(rest, exact.id);
      return;
    }

    // 2. Похожие (Levenshtein + относительный порог + общий префикс)
    const similar = categories
      .map((cat: any) => {
        const normalizedCat = normalizeCategoryName(cat.name);
        const distance = levenshtein(normalizedInput, normalizedCat);
        const maxLen = Math.max(normalizedInput.length, normalizedCat.length);
        const relativeThreshold = Math.max(3, Math.floor(maxLen * 0.4));
        const prefixLen = commonPrefixLength(normalizedInput, normalizedCat);

        const passes =
          (distance > 0 && distance <= 3) ||
          (distance > 0 && distance <= relativeThreshold) ||
          (prefixLen >= 5 && distance > 0);

        return {
          id: cat.id,
          name: cat.name,
          distance,
          prefixLen,
          passes,
        };
      })
      .filter((cat: any) => cat.passes)
      .sort((a: any, b: any) => a.distance - b.distance)
      .slice(0, 5)
      .map((c: any) => ({ id: c.id, name: c.name }));

    // 3. Модалка
    setConflict({
      isOpen: true,
      categoryName,
      similarCategories: similar,
      pendingData: rest,
    });
    setIsProcessing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => processImport(reader.result as string);
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSelectExisting = (categoryId: string) => {
    finalizeImport(conflict.pendingData, categoryId);
  };

  const handleCreateNew = async () => {
    setIsProcessing(true);
    try {
      const newCategory = await createCategory({
        name: conflict.categoryName.trim(),
      }).unwrap();

      finalizeImport(conflict.pendingData, newCategory.id);
    } catch (err: any) {
      showError(err.data?.error || err.message || 'Ошибка создания категории');
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="glitch-border rounded-xl bg-(--loom-cyan)/5 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex-1"
          >
            <Upload size={16} className="mr-2" />
            Загрузить JSON файл
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsPasteModalOpen(true)}
            disabled={isProcessing}
            className="flex-1"
          >
            <ClipboardPaste size={16} className="mr-2" />
            Вставить JSON
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
      />

      <Modal
        isOpen={isPasteModalOpen}
        onClose={() => !isProcessing && setIsPasteModalOpen(false)}
        title="Вставить JSON"
        confirmText={isProcessing ? 'Обработка...' : 'Импортировать'}
        cancelText="Отмена"
        onConfirm={() => processImport(jsonText)}
        onCancel={() => setIsPasteModalOpen(false)}
      >
        <p className="text-sm text-(--loom-white)/60 mb-3">
          Вставьте сюда содержимое JSON-файла
        </p>
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder='{"title": "...", "questions": [...]}'
          className="w-full bg-(--loom-black) border border-(--loom-white)/10 rounded-xl px-3 py-2 text-(--loom-white) focus:outline-none focus:border-(--loom-cyan) resize-y min-h-48 font-mono text-xs"
          disabled={isProcessing}
        />
      </Modal>

      <CategoryConflictModal
        isOpen={conflict.isOpen}
        categoryName={conflict.categoryName}
        similarCategories={conflict.similarCategories}
        onSelect={handleSelectExisting}
        onCreate={handleCreateNew}
        onCancel={() => setConflict((prev) => ({ ...prev, isOpen: false }))}
        isLoading={isProcessing}
      />
    </>
  );
}