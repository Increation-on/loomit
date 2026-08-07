'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/core/Button';
import { Input } from '@/components/ui/core/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/core/Card';
import { useToast } from '@/components/ui/feedback/ToastContainer';
import { Trash2, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Filters } from '@/components/ui/core/Filters';
import { useUpdateQuizMutation } from '@/store/api/quizApi';
import { Skeleton } from '@/components/ui/feedback/Skeleton';

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
        setQuestions(data.questions.map((q: any) => ({
          id: q.id,
          text: q.text,
          options: Array.isArray(q.options) ? q.options.map((o: any) =>
            typeof o === 'string' ? { id: crypto.randomUUID(), text: o } : o
          ) : [],
          correctOptionId: q.correct_option_id || q.correctOptionId || '',
          explanation: q.explanation || '',
        })));
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

  if (loading) {
    return (
      <div className="p-4 max-w-2xl mx-auto pb-24">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-40 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
          <div className="space-y-6 mt-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto pb-24">
      <h1 className="text-2xl font-bold text-(--loom-white) mb-6">Редактирование квиза</h1>

      <div className="space-y-4 mb-6">
        <label className="text-xl font-medium text-(--loom-white)/80 mb-2 block">Название</label>
        <Input
          placeholder="Название квиза"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="block text-xl font-medium text-(--loom-white)/80 mb-2">Описание</label>
        <div className="glitch-border rounded-xl bg-(--loom-white)/5 w-full overflow-hidden">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание квиза"
            className="w-full bg-transparent text-(--loom-white) rounded-xl px-4 py-3 min-h-24 h-auto resize-y focus:outline-none placeholder:text-(--loom-white)/30"
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

      <div className="space-y-4 mb-6">
        {questions.map((q, qi) => (
          <Card key={q.id} className="p-4">
            <CardHeader className="flex flex-row items-start justify-between p-0 pb-3">
              <CardTitle className="text-base">Вопрос {qi + 1}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteQuestion(qi)}
                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
              >
                <Trash2 size={16} />
              </Button>
            </CardHeader>

            <CardContent className="p-0 space-y-3">
              <Input
                placeholder={`Вопрос ${qi + 1}`}
                value={q.text}
                onChange={(e) => updateQuestionText(qi, e.target.value)}
              />

              {q.options.map((opt, oi) => (
                <div key={opt.id} className="flex gap-3 items-center">
                  <button
                    onClick={() => setCorrectOption(qi, opt.id)}
                    className={cn(
                      'w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors',
                      q.correctOptionId === opt.id
                        ? 'border-(--loom-cyan) bg-(--loom-cyan)/20'
                        : 'border-(--loom-white)/30 hover:border-(--loom-white)/50'
                    )}
                  >
                    {q.correctOptionId === opt.id && <Check size={12} className="text-(--loom-cyan)" />}
                  </button>

                  <Input
                    className="flex-1"
                    placeholder={`Вариант ${oi + 1}`}
                    value={opt.text}
                    onChange={(e) => updateOptionText(qi, oi, e.target.value)}
                  />
                </div>
              ))}

              <div className="mt-2">
                <label className="block text-sm text-(--loom-white)/60 mb-1">Объяснение (необязательно)</label>
                <textarea
                  value={q.explanation || ''}
                  onChange={(e) => updateExplanation(qi, e.target.value)}
                  placeholder="Почему этот ответ правильный?"
                  className="w-full bg-(--loom-black) border border-(--loom-white)/10 rounded-xl px-3 py-2 text-(--loom-white) focus:outline-none focus:border-(--loom-cyan) resize-y"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3 mb-20">
        <Button variant="secondary" onClick={addQuestion}>
          <Plus size={16} className="mr-2" /> Добавить вопрос
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-(--loom-black)/90 backdrop-blur-sm border-t border-(--loom-white)/10 flex gap-3 justify-end">
        <Button variant="ghost" onClick={() => router.back()}>Отмена</Button>
        <Button variant="glitch" onClick={saveQuiz} disabled={isUpdating}>
          {isUpdating ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </div>
  );
}