// app\admin\quiz\new\page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/core/Button';
import { Input } from '@/components/ui/core/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/core/Card';
import { useToast } from '@/components/ui/feedback/ToastContainer';
import { Trash2, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/feedback/Skeleton';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';

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
  const [categoryId, setCategoryId] = useState('');
  const [level, setLevel] = useState<'JUNIOR' | 'MIDDLE' | 'SENIOR'>('JUNIOR');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [saving, setSaving] = useState(false);
  const { success, error: showError } = useToast();
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery({});


  

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
        body: JSON.stringify({ title, description, categoryId, level, questions }),
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
    <div className="p-4 max-w-2xl mx-auto pb-24">
      <h1 className="text-2xl font-bold text-(--loom-white) mb-6">Новый квиз</h1>

      {/* Основная информация */}
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

        {/* Категория (кнопки-чипсы) */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-(--loom-white)/80 block mb-2">Категория</label>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categoriesLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-7 w-20 rounded-full shrink-0" />
                ))}
              </>
            ) : (
              <>
                <button
                  onClick={() => setCategoryId('')}
                  className={cn(
                    'px-3 py-1.5 text-xs rounded-full transition-colors whitespace-nowrap',
                    !categoryId
                      ? 'bg-(--loom-cyan)/20 text-(--loom-cyan)'
                      : 'bg-(--loom-white)/5 text-(--loom-white)/60 hover:bg-(--loom-white)/10'
                  )}
                >
                  Без категории
                </button>
                {categories?.map((cat: any) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-full transition-colors whitespace-nowrap',
                      categoryId === cat.id
                        ? 'bg-(--loom-cyan)/20 text-(--loom-cyan)'
                        : 'bg-(--loom-white)/5 text-(--loom-white)/60 hover:bg-(--loom-white)/10'
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Уровень */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-(--loom-white)/80 block mb-2">Уровень</label>
          <div className="flex gap-2">
            {['JUNIOR', 'MIDDLE', 'SENIOR'].map((lvl) => (
              <Button
                key={lvl}
                variant={level === lvl ? 'glitch' : 'secondary'}
                size="sm"
                onClick={() => setLevel(lvl as any)}
              >
                {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Список вопросов */}
      <div className="space-y-4 mb-6">
        {questions.map((q, qi) => (
          <Card key={q.id} className="p-4">
            <CardHeader className="flex flex-row items-start justify-between p-0 pb-3">
              <CardTitle className="text-base">
                Вопрос {qi + 1}
              </CardTitle>
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
                    {q.correctOptionId === opt.id && (
                      <Check size={12} className="text-(--loom-cyan)" />
                    )}
                  </button>

                  <Input
                    className="flex-1"
                    placeholder={`Вариант ${oi + 1}`}
                    value={opt.text}
                    onChange={(e) => updateOptionText(qi, oi, e.target.value)}
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteOption(qi, oi)}
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10 shrink-0"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}

              {/* Кнопка добавления варианта */}
              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const updated = [...questions];
                    updated[qi].options.push({ id: crypto.randomUUID(), text: '' });
                    setQuestions(updated);
                  }}
                >
                  + Вариант
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Кнопка добавления вопроса */}
      <div className="flex gap-3 mb-20">
        <Button variant="secondary" onClick={addQuestion}>
          <Plus size={16} className="mr-2" />
          Добавить вопрос
        </Button>
      </div>

      {/* Нижняя панель */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-(--loom-black)/90 backdrop-blur-sm border-t border-(--loom-white)/10 flex gap-3 justify-end">
        <Button variant="ghost" onClick={() => router.back()}>
          Отмена
        </Button>
        <Button variant="glitch" onClick={saveQuiz} disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </div>
  );
}