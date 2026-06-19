'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useGetQuizzesQuery } from '@/store/api/quizApi';
import { selectQuizState, resetQuiz } from '@/store/slices/quizSlice';
import { persistor } from '@/store/store';
import { Modal } from '@/components/ui/feedback/Modal';
import { EmptyState } from '@/components/ui/feedback/EmptyState';
import { Button } from '@/components/ui/core/Button';
import { Search } from 'lucide-react';
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

  // ✅ Фиксируем порядок карточек один раз при загрузке (не будет перескакивать)
  const [shuffledQuizzes, setShuffledQuizzes] = useState<any[]>([]);

  useEffect(() => {
    if (quizzes && quizzes.length > 0) {
      setShuffledQuizzes([...quizzes].sort(() => Math.random() - 0.5).slice(0, 5));
    }
  }, [quizzes]); // Сработает только когда загрузятся данные, а не при каждом скролле

  // ✅ Считаем ширину карточек один раз, но через useMemo (чтобы не пересчитывать при каждом рендере)
  const cardWidth = useMemo(() => 160 + 16, []); // w-40 + gap-4

  // === Анимация по скроллу ===
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [clickedId, setClickedId] = useState<string | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || shuffledQuizzes.length === 0) return;

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const index = Math.min(Math.round(scrollLeft / cardWidth), shuffledQuizzes.length - 1);
      setActiveIndex(index);
    };

    el.addEventListener('scroll', handleScroll);
    handleScroll(); // Зажигаем первую при загрузке

    return () => el.removeEventListener('scroll', handleScroll);
  }, [shuffledQuizzes, cardWidth]);

  const hasUnfinished = currentQuiz && answers.length > 0 && !isFinished;
  const isSameQuiz = currentQuiz?.id === pendingQuizId;

  const handleQuizClick = (quizId: string) => {
    // Если это тот же квиз — сразу переходим
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
      {/* Поиск */}
      <div className="p-4 mb-2">
        <div className="relative">
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

      {/* Баннер "Продолжить" / Try it */}
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
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory w-max max-w-full touch-pan-x try-it-scroll"
            >
              {shuffledQuizzes.map((quiz: any, index: number) => {
                const isActive = activeIndex === index;
                const isClicked = clickedId === quiz.id;
                return (
                  <div
                    key={quiz.id}
                    id={quiz.id}
                    onClick={() => {
                      handleQuizClick(quiz.id);
                      setClickedId(quiz.id);
                      setTimeout(() => setClickedId(null), 1000);
                    }}
                    className={`w-48 h-36 shrink-0 snap-start bg-(--loom-cyan)/20 p-4 rounded-xl cursor-pointer relative transition-all duration-300 try-it-card ${
                      isActive || isClicked ? 'snake-active' : ''
                    }`}
                  >
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-(--loom-yellow) shadow-[0_0_6px_var(--loom-yellow)]" />
                    <h3 className="font-bold text-lg text-(--loom-white) truncate">{quiz.title}</h3>
                    <p className="text-sm text-(--loom-white)/60 line-clamp-2">{quiz.description}</p>
                  </div>
                );
              })}
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