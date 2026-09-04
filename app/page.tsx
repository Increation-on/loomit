'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useGetQuizzesQuery } from '@/store/api/quizApi';
import { selectQuizState, resetQuiz } from '@/store/slices/quizSlice';
import { persistor } from '@/store/store';
import { Modal } from '@/components/ui/feedback/Modal';
import { SearchWithDropdown } from '@/components/ui/core/SearchWithDropDown';
import { TryItSkeleton } from '@/components/ui/feedback/Skeleton';
import { TryItCard } from '@/components/cards/TryItCard';
import { CategoryList } from '@/components/common/CategoryList';
import { ContinueQuizCard } from '@/components/cards/ContinueQuizCard';
import { useNavigationTransition } from '@/components/layout/NavigationProvider';

export default function HomePage() {
  const { data: quizzes, isLoading: isQuizzesLoading } = useGetQuizzesQuery({});
  const router = useRouter();
  const dispatch = useDispatch();
  const { setQuizOrigin } = useNavigationTransition();
  const quizState = useSelector(selectQuizState);
  const currentQuiz = quizState.currentQuiz;
  const answers = quizState.answers;
  const isFinished = quizState.isFinished;
  const [pendingQuizId, setPendingQuizId] = useState<string | null>(null);
  const [shuffledQuizzes, setShuffledQuizzes] = useState<any[]>([]);
  const [attemptStatuses, setAttemptStatuses] = useState<Record<string, any>>({});

  // ✅ Перемешиваем в эффекте (чистый рендер)
  useEffect(() => {
    if (!quizzes || quizzes.length === 0) return;
    const shuffled = [...quizzes].sort(() => Math.random() - 0.5).slice(0, 5);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShuffledQuizzes(shuffled);
  }, [quizzes]);

  // ✅ Защита от повторных вызовов при монтировании
  useEffect(() => {
    if (!shuffledQuizzes.length) return;
    let mounted = true;
    const fetchStatuses = async () => {
      const quizIds = shuffledQuizzes.map((q) => q.id);
      const res = await fetch('/api/quizzes/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizIds }),
      });
      const data = await res.json();
      if (mounted) {
        setAttemptStatuses(data);
      }
    };
    fetchStatuses();
    return () => { mounted = false; };
  }, [shuffledQuizzes]);

  const cardWidth = useMemo(() => 160 + 16, []);
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
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, [shuffledQuizzes, cardWidth]);

  // ⚠️ Плашка всё ещё из Redux — нужно переделать на БД
  const hasUnfinished = currentQuiz && answers.length > 0 && !isFinished;
  const isSameQuiz = currentQuiz?.id === pendingQuizId;

  const handleQuizClick = (quizId: string) => {
    setQuizOrigin('/');
    router.push(`/quiz/${quizId}/preview`);
  };

  const handleStartNew = async () => {
    await persistor.purge();
    dispatch(resetQuiz());
    setQuizOrigin('/');
    if (pendingQuizId) router.push(`/quiz/${pendingQuizId}`);
    setPendingQuizId(null);
  };

  const handleContinue = () => {
    setQuizOrigin('/');
    if (isSameQuiz) {
      router.push(`/quiz/${pendingQuizId}`);
    } else {
      router.push(`/quiz/${currentQuiz!.id}`);
    }
    setPendingQuizId(null);
  };

  return (
    <div className="min-h-screen bg-(--loom-black) text-(--loom-white) pb-24">
      <div className="p-4 mb-2">
        <SearchWithDropdown items={quizzes || []} placeholder="Поиск квизов..." origin="/"/>
      </div>

      <div className="px-4 mb-6">
        {hasUnfinished ? (
          <ContinueQuizCard
            title={currentQuiz!.title}
            answersCount={answers.length}
            onContinue={handleContinue}
          />
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Try it</h2>
            </div>
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory w-max max-w-full touch-pan-x try-it-scroll"
            >
              {isQuizzesLoading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <TryItSkeleton key={i} />
                  ))}
                </>
              ) : (
                shuffledQuizzes.map((quiz: any, index: number) => {
                  const isActive = activeIndex === index;
                  const isClicked = clickedId === quiz.id;
                  const lastAttempt = attemptStatuses[quiz.id];
                  return (
                    <TryItCard
                      key={quiz.id}
                      quiz={quiz}
                      lastAttempt={lastAttempt}
                      isActive={isActive}
                      isClicked={isClicked}
                      onClick={() => {
                        handleQuizClick(quiz.id);
                        setClickedId(quiz.id);
                        setTimeout(() => setClickedId(null), 1000);
                      }}
                    />
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 mt-6">
        <CategoryList limit={4} />
      </div>

      <Modal
        isOpen={!!pendingQuizId}
        onClose={() => setPendingQuizId(null)}
        onCancel={handleStartNew}
        title="Незавершённый квиз"
        cancelText={isSameQuiz ? 'Начать заново' : 'Начать новый квиз'}
        confirmText={isSameQuiz ? 'Продолжить' : 'Продолжить'}
        onConfirm={handleContinue}
      >
        <p>
          У вас есть незавершённый квиз <span className="text-(--loom-cyan)">«{currentQuiz?.title}»</span>.
        </p>
        <p className="text-sm mt-2 text-(--loom-white)/50">
          {isSameQuiz
            ? 'Продолжить с последнего вопроса или начать заново?'
            : 'Начать новый квиз или вернуться к незавершённому?'}
        </p>
      </Modal>
    </div>
  );
}