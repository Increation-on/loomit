'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/core/Button';
import { Input } from '@/components/ui/core/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/core/Card';
import { useToast } from '@/components/ui/feedback/ToastContainer';
import { Trash2, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { Filters } from '@/components/ui/core/Filters';
import { Modal } from '@/components/ui/feedback/Modal';
import { QuizImportBlock } from '@/components/admin/QuizImportBlock';
import { usePageHeader } from '@/hooks/usePageHeader';

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
  explanation?: string;
}

interface EditModalState {
  isOpen: boolean;
  type: 'question' | 'explanation' | 'option';
  questionIndex: number;
  optionIndex?: number;
  value: string;
}

export default function NewQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [level, setLevel] = useState<'JUNIOR' | 'MIDDLE' | 'SENIOR'>('JUNIOR');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [saving, setSaving] = useState(false);
  const { success, error: showError } = useToast();
  const { data: categories } = useGetCategoriesQuery();

  usePageHeader({ variant: 'tab', title: 'Новый квиз', showBack: true });

  const [editModal, setEditModal] = useState<EditModalState>({
    isOpen: false,
    type: 'question',
    questionIndex: -1,
    value: '',
  });

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
        explanation: '',
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

  const setCorrectOption = (questionIndex: number, optionId: string) => {
    const updated = [...questions];
    updated[questionIndex].correctOptionId = optionId;
    setQuestions(updated);
  };

  const updateExplanation = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].explanation = text;
    setQuestions(updated);
  };

  const saveQuiz = async () => {
    if (!categoryId) {
      showError('Выберите категорию');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, categoryId, level, questions }),
      });

      if (!res.ok) {
        const data = await res.json();
        const message = typeof data.error === 'string' ? data.error : 'Ошибка сохранения';
        throw new Error(message);
      }

      success('Квиз создан!');
      router.push('/admin');
    } catch (err: any) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = () => {
    const { type, questionIndex, optionIndex, value } = editModal;
    const updated = [...questions];

    if (type === 'question') {
      updated[questionIndex].text = value;
    } else if (type === 'explanation') {
      updated[questionIndex].explanation = value;
    } else if (type === 'option' && optionIndex !== undefined) {
      updated[questionIndex].options[optionIndex].text = value;
    }

    setQuestions(updated);
    setEditModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleImport = (data: {
    title: string;
    description?: string;
    categoryId: string;
    level: 'JUNIOR' | 'MIDDLE' | 'SENIOR';
    questions: any[];
  }) => {
    setTitle(data.title);
    setDescription(data.description || '');
    setCategoryId(data.categoryId);
    setLevel(data.level);
    setQuestions(data.questions);
  };

  return (
    <div className="mx-auto max-w-2xl p-4 pb-24">
      <h1 className="mb-6 text-2xl font-bold text-(--loom-white)">Новый квиз</h1>
      <QuizImportBlock onImport={handleImport} />
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-(--loom-cyan)/30 to-transparent" />
        <span className="font-mono text-xs tracking-widest text-(--loom-white)/40 uppercase">
          или
        </span>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-(--loom-cyan)/30 to-transparent" />
      </div>
      <div className="mb-6 space-y-4">
        <label className="mb-2 block text-xl font-medium text-(--loom-white)/80">Название</label>
        <Input
          placeholder="Название квиза"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="mb-2 block text-xl font-medium text-(--loom-white)/80">Описание</label>
        <div className="glitch-border w-full overflow-hidden rounded-xl bg-(--loom-white)/5">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание квиза"
            className="h-auto min-h-24 w-full resize-y rounded-xl bg-transparent px-4 py-3 text-(--loom-white) placeholder:text-(--loom-white)/30 focus:outline-none"
          />
        </div>

        <Filters
          categoryFilter={categoryId}
          setCategoryFilter={setCategoryId}
          disableAllOption={true}
          levelFilter={level}
          setLevelFilter={setLevel}
          includeLevelAll={false}
          showSort={false}
        />
      </div>

      <div className="mb-6 space-y-4">
        {questions.map((q, qi) => (
          <Card key={q.id} className="p-4">
            <CardHeader className="flex flex-row items-start justify-between p-0 pb-3">
              <CardTitle className="text-base">Вопрос {qi + 1}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteQuestion(qi)}
                className="h-8 w-8 text-red-400 hover:bg-red-400/10 hover:text-red-300"
              >
                <Trash2 size={16} />
              </Button>
            </CardHeader>

            <CardContent className="space-y-3 p-0">
              {/* Вопрос — клик открывает модалку */}
              <div
                onClick={() => {
                  setEditModal({
                    isOpen: true,
                    type: 'question',
                    questionIndex: qi,
                    value: q.text,
                  });
                }}
                className="min-h-12 w-full cursor-pointer rounded-xl border border-(--loom-white)/10 bg-(--loom-black) px-3 py-2 text-(--loom-white) transition-colors hover:border-(--loom-cyan)/50"
              >
                {q.text || (
                  <span className="text-(--loom-white)/30">Нажмите чтобы ввести вопрос</span>
                )}
              </div>

              {q.options.map((opt, oi) => (
                <div key={opt.id} className="flex items-center gap-3">
                  <button
                    onClick={() => setCorrectOption(qi, opt.id)}
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                      q.correctOptionId === opt.id
                        ? 'border-(--loom-cyan) bg-(--loom-cyan)/20'
                        : 'border-(--loom-white)/30 hover:border-(--loom-white)/50'
                    )}
                  >
                    {q.correctOptionId === opt.id && (
                      <Check size={12} className="text-(--loom-cyan)" />
                    )}
                  </button>

                  <Input
                    className="flex-1 cursor-pointer"
                    placeholder={`Вариант ${oi + 1}`}
                    value={opt.text}
                    onClick={() => {
                      setEditModal({
                        isOpen: true,
                        type: 'option',
                        questionIndex: qi,
                        optionIndex: oi,
                        value: opt.text,
                      });
                    }}
                    readOnly
                  />
                </div>
              ))}

              {/* Объяснение — клик открывает модалку */}
              <div className="mt-2">
                <label className="mb-1 block text-sm text-(--loom-white)/60">
                  Объяснение (необязательно)
                </label>
                <div
                  onClick={() => {
                    setEditModal({
                      isOpen: true,
                      type: 'explanation',
                      questionIndex: qi,
                      value: q.explanation || '',
                    });
                  }}
                  className="min-h-12 w-full cursor-pointer rounded-xl border border-(--loom-white)/10 bg-(--loom-black) px-3 py-2 text-(--loom-white) transition-colors hover:border-(--loom-cyan)/50"
                >
                  {q.explanation || (
                    <span className="text-(--loom-white)/30">
                      Нажмите чтобы добавить объяснение
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-20 flex gap-3">
        <Button variant="secondary" onClick={addQuestion}>
          <Plus size={16} className="mr-2" /> Добавить вопрос
        </Button>
      </div>

      <div className="fixed right-0 bottom-0 left-0 flex justify-end gap-3 border-t border-(--loom-white)/10 bg-(--loom-black)/90 p-4 backdrop-blur-sm">
        <Button variant="ghost" onClick={() => router.back()}>
          Отмена
        </Button>
        <Button variant="glitch" onClick={saveQuiz} disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      {/* Единая модалка для всего */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal((prev) => ({ ...prev, isOpen: false }))}
        title={
          editModal.type === 'question'
            ? 'Редактировать вопрос'
            : editModal.type === 'explanation'
              ? 'Редактировать объяснение'
              : 'Редактировать вариант'
        }
      >
        <textarea
          value={editModal.value}
          onChange={(e) => setEditModal((prev) => ({ ...prev, value: e.target.value }))}
          className="min-h-24 w-full resize-y rounded-xl border border-(--loom-white)/10 bg-(--loom-black) px-3 py-2 text-(--loom-white) focus:border-(--loom-cyan) focus:outline-none"
          placeholder={
            editModal.type === 'question'
              ? 'Введите текст вопроса'
              : editModal.type === 'explanation'
                ? 'Введите объяснение'
                : 'Введите текст варианта'
          }
          rows={4}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setEditModal((prev) => ({ ...prev, isOpen: false }))}
          >
            Отмена
          </Button>
          <Button variant="glitch" onClick={handleEditSave}>
            Сохранить
          </Button>
        </div>
      </Modal>
    </div>
  );
}
