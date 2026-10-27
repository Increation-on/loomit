'use client';

import { Button } from '@/components/ui/core/Button';
import { useToast } from '@/components/ui/feedback/ToastContainer';
import { Download, Copy } from 'lucide-react';
import { generateQuizJson } from '@/lib/utils';

interface QuizExportBlockProps {
  title: string;
  description?: string;
  categoryName: string;
  level: string;
  questions: any[];
}

export function QuizExportBlock({
  title,
  description,
  categoryName,
  level,
  questions,
}: QuizExportBlockProps) {
  const { success, error: showError } = useToast();

  // Общая функция для получения JSON-строки
  const getJsonString = () => {
    return generateQuizJson({
      title,
      description,
      categoryName,
      level,
      questions,
    });
  };

  const handleDownload = () => {
    try {
      const jsonString = getJsonString();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Создаем безопасное имя файла (транслит или просто заменяем пробелы)
      const safeTitle = (title || 'quiz').trim().replace(/[^a-zA-Z0-9а-яА-ЯёЁ\-_ ]/g, '').replace(/\s+/g, '-');
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${safeTitle || 'quiz'}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Очищаем память
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      success('Файл скачан');
    } catch (err) {
      console.error(err);
      showError('Ошибка скачивания файла');
    }
  };

  const handleCopy = async () => {
    try {
      const jsonString = getJsonString();
      await navigator.clipboard.writeText(jsonString);
      success('JSON скопирован в буфер обмена');
    } catch (err) {
      console.error(err);
      showError('Ошибка копирования (возможно, нет доступа к буферу)');
    }
  };

  // Если вопросов нет, экспорт не имеет смысла
  const isDisabled = questions.length === 0;

  return (
    <div className="glitch-border mb-6 rounded-xl bg-(--loom-yellow)/5 p-4 mt-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="secondary"
          onClick={handleDownload}
          disabled={isDisabled}
          className="flex-1"
        >
          <Download size={16} className="mr-2" />
          Скачать JSON
        </Button>
        <Button
          variant="secondary"
          onClick={handleCopy}
          disabled={isDisabled}
          className="flex-1"
        >
          <Copy size={16} className="mr-2" />
          Скопировать JSON
        </Button>
      </div>
    </div>
  );
}
