/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useGetQuizzesQuery, useGetQuizByIdQuery, useCancelAttemptMutation } from '@/store/api/quizApi';
import { selectQuizState, resetQuiz } from '@/store/slices/quizSlice';
import { persistor } from '@/store/store';
import { SearchWithDropdown } from '@/components/ui/core/SearchWithDropDown';
import { TryItSkeleton, ContinueQuizSkeleton } from '@/components/ui/feedback/Skeleton';
import { TryItCard } from '@/components/cards/TryItCard';
import { CategoryList } from '@/components/common/CategoryList';
import { ContinueQuizCard } from '@/components/cards/ContinueQuizCard';
import { useNavigationTransition } from '@/components/layout/NavigationProvider';

export default function HomePage() {
  const { data: quizzes = [], isLoading: isQuizzesLoading } = useGetQuizzesQuery({});
  const [cancelAttempt] = useCancelAttemptMutation();
  
  const router = useRouter();
  const dispatch = useDispatch();
  const { setQuizOrigin } = useNavigationTransition();
  
  // База правды для мгновенного UX-эффекта при загрузке — локальный Redux
  const quizState = useSelector(selectQuizState);
  const currentQuiz = quizState.currentQuiz;
  const answers = quizState.answers;
  const isFinished = quizState.isFinished;

  const [isCancelling, setIsCancelling] = useState(false);
  const [shuffledQuizzes, setShuffledQuizzes] = useState<any[]>([]);
  const [attemptStatuses, setAttemptStatuses] = useState<Record<string, any>>({});

  const { data: currentQuizData, isFetching: isQuizDetailsFetching } = useGetQuizByIdQuery(
    currentQuiz?.id || '', 
    { 
      skip: !currentQuiz?.id,
      refetchOnMountOrArgChange: true
    }
  );
  
  const activeAttemptId = currentQuizData?.activeAttemptId;
  const totalQuestions = currentQuizData?.questions?.length || 0;

  useEffect(() => {
    if (!quizzes || quizzes.length === 0) return;
    const shuffled = [...quizzes].sort(() => Math.random() - 0.5).slice(0, 5);
    setShuffledQuizzes(shuffled);
  }, [quizzes]);

  useEffect(() => {
    if (!shuffledQuizzes.length) return;
    let mounted = true;
    const fetchStatuses = async () => {
      const quizIds = shuffledQuizzes.map((q) => q.id);
      try {
        const res = await fetch('/api/quizzes/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quizIds }),
        });
        const data = await res.json();
        if (mounted) {
          setAttemptStatuses(data);
        }
      } catch (e) {
        console.error(e);
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

  // Проверяем, есть ли принципиальная отметка о квизе в Redux (инициализация UI)
  const hasLocalUnfinished = !!currentQuiz && answers.length > 0 && !isFinished;

  // Истинный признак наличия незаконченного квиза.
  // ⚡ Важно: если идет отмена (isCancelling === true), этот флаг мгновенно падает в false!
  const hasUnfinished = hasLocalUnfinished && !isCancelling && (isQuizDetailsFetching ? true : (currentQuizData ? !!activeAttemptId : true));

  // ⚡ Фикс заголовка: "Continue?" пишется ТОЛЬКО если квиз реально есть и мы его НЕ отменяем в данный момент
  const showContinueSection = hasUnfinished;

  const handleQuizClick = (quizId: string) => {
    setQuizOrigin('/');
    router.push(`/quiz/${quizId}/preview`);
  };

  const handleContinue = () => {
    if (!currentQuiz?.id) return;
    setQuizOrigin('/');
    router.push(`/quiz/${currentQuiz.id}`);
  };

  const handleCancel = async () => {
    const targetAttemptId = activeAttemptId || quizState.attemptId;

    if (!targetAttemptId || isCancelling) return;
    
    // ⚡ Мгновенно переключаем стейт. hasUnfinished станет false, заголовок сменится на "Try it"
    setIsCancelling(true);
    
    try {
      await cancelAttempt(targetAttemptId).unwrap();
      dispatch(resetQuiz());
      await persistor.purge();
    } catch (error) {
      console.error('❌ Cancel error:', error);
      // Локальный откат стейта в случае форс-мажора (ошибки сервера)
      setIsCancelling(false);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--loom-black) text-(--loom-white) pb-24 relative">
      {isCancelling && (
        <div className="absolute inset-0 z-50 bg-transparent cursor-not-allowed" />
      )}

      <div className="p-4 mb-2">
        <SearchWithDropdown items={quizzes} placeholder="Поиск квизов..." origin="/" />
      </div>

      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          {/* ⚡ Динамический заголовок секции */}
          <h2 className="text-lg font-bold">
            {showContinueSection ? 'Continue?' : 'Try it'}
          </h2>
        </div>

        {/* ⚡ НОВЫЙ ИДЕАЛЬНЫЙ СТЕК ОПРЕДЕЛЕНИЯ СКЕЛЕТОНОВ */}
        {showContinueSection ? (
          // Единый этаж для "Continue?" блока
          isQuizDetailsFetching && !activeAttemptId ? (
            // Сервер еще не вернул данные по квизу, но локальный Redux говорит что он есть
            <ContinueQuizSkeleton />
          ) : (
            <ContinueQuizCard
              title={currentQuiz!.title}
              answersCount={answers.length}
              totalQuestions={totalQuestions || answers.length}
              onContinue={handleContinue}
              onCancel={handleCancel}
            />
          )
        ) : (
          // Единый этаж для "Try it" блока
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory w-max max-w-full touch-pan-x try-it-scroll"
          >
            {isQuizzesLoading || isCancelling || shuffledQuizzes.length === 0 ? (
              // ⚡ Если список еще грузится ИЛИ идет процесс отмены квиза — рендерим ровный TryItSkeleton!
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
        )}
      </div>

      <div className="px-4 mt-6">
        <CategoryList limit={4} />
      </div>
    </div>
  );
}
