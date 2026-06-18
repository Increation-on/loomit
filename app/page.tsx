'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useGetQuizzesQuery } from '@/store/api/quizApi';
import { selectQuizState, resetQuiz } from '@/store/slices/quizSlice';
import { persistor } from '@/store/store';
import { Modal } from '@/components/ui/feedback/Modal';
import { EmptyState } from '@/components/ui/feedback/EmptyState';
import { QuizCardSkeleton } from '@/components/ui/feedback/Skeleton';
import { Button } from '@/components/ui/core/Button';
import { ArrowRight, Search } from 'lucide-react';

export default function HomePage() {

  // Временные моковые данные (пока нет реальных квизов)
  const mockQuizzes = [
    { id: '1', title: 'React для начинающих', description: 'Изучите хуки, состояние и жизненный цикл', _count: { questions: 10 } },
    { id: '2', title: 'Основы JavaScript', description: 'Переменные, функции, замыкания', _count: { questions: 15 } },
    { id: '3', title: 'TypeScript Mastery', description: 'Типы, интерфейсы, дженерики', _count: { questions: 12 } },
    { id: '4', title: 'Next.js с нуля', description: 'SSR, ISR, App Router', _count: { questions: 8 } },
    { id: '5', title: 'Алгоритмы и структуры', description: 'Сортировки, графы, деревья', _count: { questions: 20 } },
  ];

  // Замени в коде `quizzes` на `mockQuizzes` для теста
  const displayedQuizzes = mockQuizzes; // Или quizzes, если данные есть

  const { data: quizzes, isLoading, error } = useGetQuizzesQuery({});
  const router = useRouter();
  const dispatch = useDispatch();
  const quizState = useSelector(selectQuizState);
  const currentQuiz = quizState.currentQuiz;
  const answers = quizState.answers;
  const isFinished = quizState.isFinished;
  const [pendingQuizId, setPendingQuizId] = useState<string | null>(null);

  const hasUnfinished = currentQuiz && answers.length > 0 && !isFinished;
  const isSameQuiz = currentQuiz?.id === pendingQuizId;


  const handleQuizClick = (quizId: string) => {
    if (hasUnfinished) {
      setPendingQuizId(quizId);
    } else {
      router.push(`/quiz/${quizId}`);
    }
  };

  const handleStartNew = async () => {
    await persistor.purge();
    dispatch(resetQuiz());
    if (pendingQuizId) {
      router.push(`/quiz/${pendingQuizId}`);
    }
    setPendingQuizId(null);
  };

  const handleContinue = () => {
    if (isSameQuiz) {
      router.push(`/quiz/${pendingQuizId}`);
    } else {
      router.push(`/quiz/${currentQuiz!.id}`);
    }
    setPendingQuizId(null);
  };

  return (
    <div className="min-h-screen bg-(--loom-black) text-(--loom-white) pb-24">
      {/* Верхняя панель */}
      <div className="p-4">
        {/* Поиск */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Поиск квизов..."
            className="w-full bg-(--loom-white)/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none text-(--loom-white) glitch-border"
          />
        </div>
      </div>

      {/* Баннер "Продолжить квиз" (Hero) */}
      <div className="px-4 mb-6">
        {!hasUnfinished && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Try it</h2>
            </div>
            {/* Карточки Try it */}
           <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory w-max max-w-full touch-pan-x">
  {quizzes && [...quizzes]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5)
    .map((quiz: any) => (
      <div 
        key={quiz.id} 
        onClick={() => handleQuizClick(quiz.id)}
        className="w-40 h-36 shrink-0 snap-start bg-(--loom-cyan)/20 p-4 rounded-xl cursor-pointer relative glitch-border"
      >
        {/* Левая циановая рамка */}
        <div className="absolute left-0 top-1 bottom-1 w-[4px] bg-(--loom-cyan) rounded-l-lg" />

        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-(--loom-yellow) shadow-[0_0_6px_var(--loom-yellow)]" />

        <h3 className="font-bold text-lg text-(--loom-white) leading-tight mb-2">{quiz.title}</h3>
        <p className="text-sm text-(--loom-white)/60 line-clamp-2">{quiz.description}</p>
      </div>
    ))}
</div>
          </div>
        )}
      </div>

      {/* Категории */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Категории</h2>
          {quizzes && quizzes.length > 4 && (
            <Link href="/catalog" className="text-sm text-(--loom-yellow)">Все категории →</Link>
          )}
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-10">
            <p className="text-red-400 mb-4">Не удалось загрузить квизы</p>
            <Button onClick={() => window.location.reload()}>Повторить</Button>
          </div>
        )}

        {quizzes && quizzes.length > 0 ? (
          <div className="space-y-3">
            {quizzes.slice(0, quizzes.length > 4 ? 4 : quizzes.length).map((quiz: any) => (
              <div
                key={quiz.id}
                onClick={() => handleQuizClick(quiz.id)}
                className="bg-(--loom-white)/5 rounded-2xl p-4 border border-gray-800 cursor-pointer hover:border-(--loom-yellow) transition-colors flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">{quiz.title}</h3>
                  <p className="text-sm text-gray-400">{quiz._count?.questions} вопросов</p>
                </div>
                <ArrowRight size={16} className="text-(--loom-white)/40" />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Нет доступных квизов"
            description="Загляните позже, скоро здесь появятся новые квизы."
          />
        )}
      </div>

      {/* Модалка */}
      <Modal
        isOpen={!!pendingQuizId}
        onClose={() => setPendingQuizId(null)}
        onCancel={handleStartNew}
        title="Незавершённый квиз"
        cancelText={isSameQuiz ? 'Начать заново' : 'Начать новый квиз'}
        confirmText={isSameQuiz ? 'Продолжить' : `Продолжить «${currentQuiz?.title}»`}
        onConfirm={handleContinue}
      >
        <p>
          У вас есть незавершённый квиз <strong>«{currentQuiz?.title}»</strong>.
        </p>
        <p className="text-sm mt-2 text-gray-500">
          {isSameQuiz
            ? 'Продолжить с последнего вопроса или начать заново?'
            : 'Начать новый квиз или вернуться к старому?'}
        </p>
      </Modal>
    </div>
  );
}