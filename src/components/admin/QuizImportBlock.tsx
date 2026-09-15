'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/core/Button';
import { Modal } from '@/components/ui/feedback/Modal';
import { useToast } from '@/components/ui/feedback/ToastContainer';
import { categoryApi } from '@/store/api/categoryApi';
import { Upload, ClipboardPaste } from 'lucide-react';
import { CategoryConflictModal } from './CategoryConflictModal';

export function QuizImportBlock() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { success, error: showError } = useToast();

  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const [conflict, setConflict] = useState<{
    isOpen: boolean;
    categoryName: string;
    similarCategories: { id: string; name: string }[];
    parsedData: any;
  }>({
    isOpen: false,
    categoryName: '',
    similarCategories: [],
    parsedData: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const importQuiz = async (jsonString: string, overrides?: { forceCategoryId?: string; forceCreateCategory?: boolean }) => {
    setIsImporting(true);
    try {
      const parsed = overrides ? { ...conflict.parsedData, ...overrides } : JSON.parse(jsonString);

      const res = await fetch('/api/admin/quizzes/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === 'CATEGORY_CONFLICT') {
          setConflict({
            isOpen: true,
            categoryName: data.categoryName,
            similarCategories: data.similarCategories,
            parsedData: parsed,
          });
          return;
        }
        throw new Error(data.error || 'Ошибка импорта');
      }

      success('Квиз импортирован!');

      // 🔑 Инвалидируем кэш категорий, чтобы новая категория появилась в Filters
      dispatch(categoryApi.util.invalidateTags(['Categories']));

      setIsPasteModalOpen(false);
      setJsonText('');
      setConflict(prev => ({ ...prev, isOpen: false }));
      router.push(`/admin/quiz/${data.quiz.id}`);
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        showError('Не удалось прочитать JSON. Проверьте формат файла.');
      } else {
        showError(err.message || 'Ошибка импорта');
      }
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      importQuiz(reader.result as string);
    };
    reader.readAsText(file);

    e.target.value = '';
  };

  return (
    <>
      <div className="glitch-border rounded-xl bg-(--loom-cyan)/5 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="flex-1"
          >
            <Upload size={16} className="mr-2" />
            Загрузить файл
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsPasteModalOpen(true)}
            disabled={isImporting}
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
        onClose={() => !isImporting && setIsPasteModalOpen(false)}
        title="Вставить JSON"
        confirmText={isImporting ? 'Импорт...' : 'Импортировать'}
        cancelText="Отмена"
        onConfirm={() => importQuiz(jsonText)}
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
          disabled={isImporting}
        />
      </Modal>

      <CategoryConflictModal
        isOpen={conflict.isOpen}
        categoryName={conflict.categoryName}
        similarCategories={conflict.similarCategories}
        onSelect={(id) => importQuiz('', { forceCategoryId: id })}
        onCreate={() => importQuiz('', { forceCreateCategory: true })}
        onCancel={() => setConflict(prev => ({ ...prev, isOpen: false }))}
        isLoading={isImporting}
      />
    </>
  );
}