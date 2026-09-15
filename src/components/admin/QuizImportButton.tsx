'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/core/Button';
import { Modal } from '@/components/ui/feedback/Modal';
import { useToast } from '@/components/ui/feedback/ToastContainer';
import { useGetQuizzesQuery } from '@/store/api/quizApi';
import { Upload, ClipboardPaste } from 'lucide-react';

interface QuizImportButtonProps {
  onSuccess?: () => void;
}

export function QuizImportButton({ onSuccess }: QuizImportButtonProps) {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const { refetch } = useGetQuizzesQuery({});

  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Общая логика импорта
  const importQuiz = async (jsonString: string) => {
    setIsImporting(true);
    try {
      const parsed = JSON.parse(jsonString);

      const res = await fetch('/api/admin/quizzes/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();

      if (!res.ok) {
        // Специальная обработка конфликта категорий
        if (data.code === 'CATEGORY_CONFLICT') {
          // TODO: показать CategoryConflictModal
          showError(`Категория «${data.categoryName}» не найдена. Похожие: ${data.similarCategories.map((c: any) => c.name).join(', ')}`);
          return;
        }
        throw new Error(data.error || 'Ошибка импорта');
      }

      success('Квиз импортирован!');
      setIsPasteModalOpen(false);
      setJsonText('');
      refetch();
      onSuccess?.();

      // Редирект на редактирование
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

  // Загрузка из файла
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      importQuiz(reader.result as string);
    };
    reader.readAsText(file);

    // Сброс input, чтобы можно было выбрать тот же файл снова
    e.target.value = '';
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
        >
          <Upload size={16} className="mr-2" />
          Загрузить файл
        </Button>
        <Button
          variant="secondary"
          onClick={() => setIsPasteModalOpen(true)}
          disabled={isImporting}
        >
          <ClipboardPaste size={16} className="mr-2" />
          Вставить JSON
        </Button>
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
    </>
  );
}