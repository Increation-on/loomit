'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/core/Button';
import { Input } from '@/components/ui/core/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/core/Card';
import { useToast } from '@/components/ui/feedback/ToastContainer';
import { Trash2, Plus, Check } from 'lucide-react';
import { cn, resolveCodeLang } from '@/lib/utils'; // <-- добавили resolveCodeLang
import { Filters } from '@/components/ui/core/Filters';
import { useUpdateQuizMutation } from '@/store/api/quizApi';
import { Skeleton } from '@/components/ui/feedback/Skeleton';
import { Modal } from '@/components/ui/feedback/Modal';
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
  code?: string | null;     // <-- добавили
  codeLang?: string | null; // <-- добавили
}

interface EditModalState {
  isOpen: boolean;
  type: 'question' | 'explanation' | 'option' | 'code'; // <-- добавили 'code'
  questionIndex: number;
  optionIndex?: number;
  value: string;
}

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [level, setLevel] = useState<'JUNIOR' | 'MIDDLE' | 'SENIOR'>('JUNIOR');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error: showError } = useToast();
  const [updateQuiz, { isLoading: isUpdating }] = useUpdateQuizMutation();

  usePageHeader({ variant: 'tab', title: 'Редактирование', showBack: true });

  const [editModal, setEditModal] = useState<EditModalState>({
    isOpen: false,
    type: 'question',
    questionIndex: -1,
    value: '',
  });

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const res = await fetch(`/api/admin/quizzes/${id}`);
        if (!res.ok) throw new Error('Ошибка загрузки');
        const data = await res.json();

        setTitle(data.title);
        setDescription(data.description || '');
        setCategoryId(data.category_id || '');
        setLevel(data.level || 'JUNIOR');
        setQuestions(
          data.questions.map((q: any) => ({
            id: q.id,
            text: q.text,
            options: Array.isArray(q.options)
              ? q.options.map((o: any) =>
                typeof o === 'string' ? { id: crypto.randomUUID(), text: o } : o
              )
              : [],
            correctOptionId: q.correct_option_id || q.correctOptionId || '',
            explanation: q.explanation || '',
            code: q.code ?? null,         // <-- добавили маппинг
            codeLang: q.codeLang ?? null, // <-- добавили маппинг
          }))
        );
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        showError('Не удалось загрузить квиз');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [id, showError]);

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
        code: null,      // <-- добавили
        codeLang: null,  // <-- добавили
      },
    ]);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const setCorrectOption = (questionIndex: number, optionId: string) => {
    const updated = [...questions];
    updated[questionIndex].correctOptionId = optionId;
    setQuestions(updated);
  };

  const saveQuiz = async () => {
    if (!categoryId) {
      showError('Выберите категорию');
      return;
    }

    try {
      await updateQuiz({
        id,
        title,
        description,
        categoryId,
        level,
        questions,
      }).unwrap();
      success('Квиз обновлён!');
      router.push('/admin');
    } catch (err: any) {
      showError(err.data?.error || err.message || 'Ошибка сохранения');
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
    } else if (type === 'code') {
      // <-- новая ветка для кода
      const codeValue = value.trim() || null;
      updated[questionIndex].code = codeValue;
      updated[questionIndex].codeLang = resolveCodeLang(codeValue, updated[questionIndex].codeLang);
    }

    setQuestions(updated);
    setEditModal((prev) => ({ ...prev, isOpen: false }));
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl p-4 pb-24">
        <Skeleton className="mb-6 h-10 w-64" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-40 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
          <div className="mt-6 space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-4 pb-24">
      <h1 className="mb-6 text-2xl font-bold text-(--loom-white)">Редактирование квиза</h1>

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
          levelFilter={level}
          setLevelFilter={setLevel}
          disableAllOption={true}
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

              {/* Код — клик открывает модалку (НОВЫЙ БЛОК) */}
              <div className="mt-2">
                <label className="mb-1 block text-sm text-(--loom-white)/60">
                  Код (необязательно)
                </label>
                <div
                  onClick={() => {
                    setEditModal({
                      isOpen: true,
                      type: 'code',
                      questionIndex: qi,
                      value: q.code || '',
                    });
                  }}
                  className="min-h-12 w-full cursor-pointer rounded-xl border border-(--loom-white)/10 bg-(--loom-black) px-3 py-2 font-mono text-sm text-(--loom-white) transition-colors hover:border-(--loom-cyan)/50"
                >
                  {q.code ? (
                    <span className="line-clamp-3 block whitespace-pre-wrap">{q.code}</span>
                  ) : (
                    <span className="font-sans text-(--loom-white)/30">
                      Нажмите чтобы добавить код
                    </span>
                  )}
                </div>
              </div>

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
        <Button variant="glitch" onClick={saveQuiz} disabled={isUpdating}>
          {isUpdating ? 'Сохранение...' : 'Сохранить'}
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
              : editModal.type === 'code'
                ? 'Редактировать код'
                : 'Редактировать вариант'
        }
      >
        <textarea
          value={editModal.value}
          onChange={(e) => setEditModal((prev) => ({ ...prev, value: e.target.value }))}
          // <-- для кода добавляем моноширинный шрифт
          className={cn(
            'min-h-24 w-full resize-y rounded-xl border border-(--loom-white)/10 bg-(--loom-black) px-3 py-2 text-(--loom-white) focus:border-(--loom-cyan) focus:outline-none',
            editModal.type === 'code' && 'font-mono text-sm'
          )}
          placeholder={
            editModal.type === 'question'
              ? 'Введите текст вопроса'
              : editModal.type === 'explanation'
                ? 'Введите объяснение'
                : editModal.type === 'code'
                  ? 'Введите код'
                  : 'Введите текст варианта'
          }
          rows={editModal.type === 'code' ? 6 : 4}
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
