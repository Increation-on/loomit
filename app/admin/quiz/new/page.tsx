'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/core/Button';
import { useToast } from '@/components/ui/feedback/ToastContainer';

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
}

export default function NewQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [saving, setSaving] = useState(false);
  const { success, error: showError } = useToast();

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        text: '',
        options: [
          { id: crypto.randomUUID(), text: '' },
          { id: crypto.randomUUID(), text: '' },
          { id: crypto.randomUUID(), text: '' },
          { id: crypto.randomUUID(), text: '' },
        ],
        correctOptionId: '',
      },
    ]);
  };

  const updateQuestionText = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].text = text;
    setQuestions(updated);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateOptionText = (questionIndex: number, optionIndex: number, text: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex].text = text;
    setQuestions(updated);
  };

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options = updated[questionIndex].options.filter((_, i) => i !== optionIndex);
    setQuestions(updated);
  };

  const setCorrectOption = (questionIndex: number, optionId: string) => {
    const updated = [...questions];
    updated[questionIndex].correctOptionId = optionId;
    setQuestions(updated);
  };

  const saveQuiz = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, questions }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка сохранения');
      }

      success('Квиз создан!');
      router.push('/admin');
    } catch (err: any) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-loom-white mb-6">Новый квиз</h1>

      <div className="space-y-4 mb-6">
        <input
          className="w-full p-3 rounded-lg bg-loom-dark-secondary text-loom-white border border-loom-purple/20"
          placeholder="Название квиза"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-3 rounded-lg bg-loom-dark-secondary text-loom-white border border-loom-purple/20"
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-4 mb-6">
        {questions.map((q, qi) => (
          <div key={q.id} className="p-4 bg-loom-dark-secondary rounded-lg space-y-3">
            <input
              className="w-full p-2 rounded bg-loom-black text-loom-white border border-loom-purple/20"
              placeholder={`Вопрос ${qi + 1}`}
              value={q.text}
              onChange={(e) => updateQuestionText(qi, e.target.value)}
            />
            {q.options.map((opt, oi) => (
              <div key={opt.id} className="flex gap-2 items-center">
                <input
                  type="radio"
                  name={`correct-${q.id}`}
                  checked={q.correctOptionId === opt.id}
                  onChange={() => setCorrectOption(qi, opt.id)}
                />
                <input
                  className="flex-1 p-2 rounded bg-loom-black text-loom-white border border-loom-purple/20"
                  placeholder={`Вариант ${oi + 1}`}
                  value={opt.text}
                  onChange={(e) => updateOptionText(qi, oi, e.target.value)}
                />
                <button
                  onClick={() => deleteOption(qi, oi)}
                  className="text-red-400 text-sm hover:text-red-300 shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
            <div className="flex gap-3">
              <button
                onClick={() => deleteQuestion(qi)}
                className="text-red-400 text-sm hover:text-red-300"
              >
                Удалить вопрос
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-20">
        <Button variant="secondary" onClick={addQuestion}>
          + Добавить вопрос
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-loom-black border-t border-loom-purple/20 flex gap-3 justify-end">
        <Button variant="ghost" onClick={() => router.back()}>
          Отмена
        </Button>
        <Button onClick={saveQuiz} disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </div>
  );
}