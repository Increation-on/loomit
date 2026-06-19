'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useGetQuizzesQuery } from '@/store/api/quizApi';
import { selectQuizState, resetQuiz } from '@/store/slices/quizSlice';
import { persistor } from '@/store/store';
import { Modal } from '@/components/ui/feedback/Modal';
import { EmptyState } from '@/components/ui/feedback/EmptyState';
import { Button } from '@/components/ui/core/Button';
import { Search, Bell, ArrowRight } from 'lucide-react';
import { pluralize } from '@/lib/utils';

export default function HomePage() {
  const { data: quizzes, isLoading, error } = useGetQuizzesQuery({});
  const router = useRouter();
  const dispatch = useDispatch();
  const quizState = useSelector(selectQuizState);
  const currentQuiz = quizState.currentQuiz;
  const answers = quizState.answers;
  const isFinished = quizState.isFinished;
  const [pendingQuizId, setPendingQuizId] = useState<string | null>(null);

  // === Отслеживаем активную карточку для анимации змейки ===
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  useEffect(() => {
  // 1. Если квизы загружены и есть хотя бы одна карточка — активируем первую
  if (quizzes && quizzes.length > 0) {
    setActiveQuizId(quizzes[0].id);
  }

  // 2. Настраиваем IntersectionObserver для отслеживания смены карточек
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveQuizId(entry.target.id);
        }
      });
    },
    {
      root: document.querySelector('.try-it-scroll'),
      threshold: 0.6,
    }
  );

  // 3. Находим все карточки и начинаем следить за ними
  const cards = document.querySelectorAll('.try-it-card');
  cards.forEach((el) => observer.observe(el));

  // 4. Чистим за собой при размонтировании
  return () => observer.disconnect();
}, [quizzes]);
  // ===============================================

  const hasUnfinished = currentQuiz && answers.length > 0 && !isFinished;
  const isSameQuiz = currentQuiz?.id === pendingQuizId;

  const userName = "Maksim";

  const handleQuizClick = (quizId: string) => {
    // Если это тот же самый квиз — сразу переходим
    if (currentQuiz?.id === quizId) {
      router.push(`/quiz/${quizId}`);
      return;
    }

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
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <div className="glitch-border w-full rounded-xl overflow-hidden">
            <input
              type="text"
              placeholder="Поиск квизов..."
              className="w-full bg-(--loom-white)/10 py-3 pl-10 pr-4 focus:outline-none text-(--loom-white)"
            />
          </div>
        </div>
      </div>

      {/* Баннер "Продолжить квиз" / Try it */}
      <div className="px-4 mb-6">
        {hasUnfinished ? (
          <div className="bg-(--loom-white)/5 p-3 rounded-xl border border-(--loom-cyan)/30 flex items-center justify-between glitch-border">
            <div className="flex flex-col">
              <span className="text-xs text-(--loom-white)/60">Продолжить</span>
              <span className="font-semibold text-(--loom-white) text-sm">{currentQuiz?.title}</span>
              <span className="text-[10px] text-(--loom-white)/40 mt-0.5">
                {answers.length} {pluralize(answers.length, 'вопрос', 'вопроса', 'вопросов')}
              </span>
            </div>
            <Button variant="glitch" size="sm" onClick={() => handleQuizClick(currentQuiz!.id)}>
              Go
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Try it</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory w-max max-w-full touch-pan-x try-it-scroll">
              {quizzes && [...quizzes]
                .sort(() => Math.random() - 0.5)
                .slice(0, 5)
                .map((quiz: any) => (
                  <div
                    key={quiz.id}
                    id={quiz.id}
                    onClick={() => handleQuizClick(quiz.id)}
                    className={`w-48 h-36 shrink-0 snap-start bg-(--loom-cyan)/20 p-4 rounded-xl cursor-pointer relative transition-all duration-300 try-it-card ${
                      activeQuizId === quiz.id ? 'snake-active' : ''
                    }`}
                  >
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-(--loom-yellow) shadow-[0_0_6px_var(--loom-yellow)]" />
                    <h3 className="font-bold text-lg text-(--loom-white) truncate">{quiz.title}</h3>
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
                className="bg-(--loom-white)/5 rounded-2xl p-4 cursor-pointer flex justify-between items-center relative glitch-border"
              >
                <div>
                  <h3 className="font-bold">{quiz.title}</h3>
                  <p className="text-sm text-gray-400">{quiz._count?.questions} вопросов</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-(--loom-yellow) shadow-[0_0_6px_var(--loom-yellow)]" />
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