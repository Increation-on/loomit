// src/components/quiz/QuizContent.tsx — ФИНАЛЬНАЯ ВЕРСИЯ

'use client';

import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentQuestion,
  selectScore,
  selectSelectedOption,
  selectQuizState,
  startQuiz,
  resumeQuizFromServer,
  resetQuiz,
  selectOption,
  confirmAnswer,
  nextQuestion,
  finishQuiz,
  selectQuestionOrder,
} from '@/store/slices/quizSlice';
import { useEffect, useRef, useState } from 'react';
import { persistor } from '@/store/store';
import { useGetQuizByIdQuery } from '@/store/api/quizApi';
import { useSession } from 'next-auth/react';
import { useGetFavoritesQuery, useToggleFavoriteMutation } from '@/store/api/favoritesApi';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/feedback/Skeleton';
import { usePWA } from '@/hooks/usePWA';
import { QuizFinishScreen } from './QuizFinishScreen';
import { Modal } from '@/components/ui/feedback/Modal';
import { useSaveAttempt } from '@/hooks/useSaveAttempt';
import { useQuizNavigation } from '@/hooks/useQuizNavigation';
import { QuizQuestion } from './QuizQuestion';
import { QuizSkeleton } from '@/components/ui/feedback/Skeleton';

export function QuizContent({ id }: { id: string }) {
  const dispatch = useDispatch();
  const currentQuestion = useSelector(selectCurrentQuestion);
  const score = useSelector(selectScore);
  const selectedOption = useSelector(selectSelectedOption);
  const { questions, answers, currentIndex, isFinished, currentQuiz, attemptId: reduxAttemptId } =
    useSelector(selectQuizState);
  const questionOrder = useSelector(selectQuestionOrder);

  const {
    data: quizData,
    isLoading: quizLoading,
    isFetching,
    refetch: refetchQuiz,
  } = useGetQuizByIdQuery(id);
  const { data: session } = useSession();
  const { data: favorites = [] } = useGetFavoritesQuery(undefined, { skip: !session });
  const [toggleFavorite] = useToggleFavoriteMutation();
  const { redirecting, setRedirecting } = useQuizNavigation();

  const { attemptId, setAttemptId, saveStep } = useSaveAttempt(id);
  const hideNavigation = usePWA();

  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [selectedExplanation, setSelectedExplanation] = useState<string | null>(null);
  const [resetCounter, setResetCounter] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // ← защита от двойного нажатия

  const isInitializingRef = useRef(false);

  // Блокировка скролла в PWA
  useEffect(() => {
    if (hideNavigation) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [hideNavigation]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((fav) => fav.quiz.id)),
    [favorites]
  );

  // Сброс стора при смене квиза
  useEffect(() => {
    if (currentQuiz && currentQuiz.id && currentQuiz.id !== id) {
      persistor.purge();
      dispatch(resetQuiz());
    }
  }, [id, currentQuiz, dispatch]);

  // ============================================================
  // ИНИЦИАЛИЗАЦИЯ (объединённая)
  // ============================================================
  useEffect(() => {
    if (isInitializingRef.current) return;

    const initializeQuiz = async () => {
      isInitializingRef.current = true;
      setIsSessionLoading(true);

      try {
        const freshData = await refetchQuiz().unwrap();

        if (!freshData) {
          setIsSessionLoading(false);
          isInitializingRef.current = false;
          return;
        }

        // 🔹 Восстановление сессии
        if (freshData.activeAttemptId && resetCounter === 0) {
          try {
            const res = await fetch(`/api/attempts/${freshData.activeAttemptId}`, {
              cache: 'no-store',
            });
            const data = await res.json();

            if (data.success && data.attempt) {
              if (data.attempt.status === 'COMPLETED') {
                setAttemptId(null);
                dispatch(resetQuiz());
                setIsSessionLoading(false);
                isInitializingRef.current = false;
                return;
              }

              setAttemptId(data.attempt.id);
              dispatch(
                resumeQuizFromServer({
                  quiz: { id: data.attempt.quizId, title: data.attempt.title },
                  questions: data.questions,
                  answers: data.attempt.answers,
                  currentIndex: data.attempt.currentIndex,
                  attemptId: data.attempt.id,
                  startedAt: data.attempt.startedAt,
                  questionOrder: data.attempt.questionOrder || [],
                })
              );
              setIsSessionLoading(false);
              isInitializingRef.current = false;
              return;
            }
          } catch (error) {
            console.error('❌ Ошибка восстановления попытки:', error);
            setIsSessionLoading(false);
            isInitializingRef.current = false;
          }
        }

        // 🔹 Если нет активной попытки — показываем вопросы
        if (!freshData.activeAttemptId) {
          dispatch(
            startQuiz({
              quiz: { id: freshData.id, title: freshData.title },
              questions: freshData.questions,
              attemptId: null,
            })
          );
          setIsSessionLoading(false);
          isInitializingRef.current = false;
          return;
        }

        setIsSessionLoading(false);
        isInitializingRef.current = false;
      } catch (error) {
        console.error('❌ Ошибка инициализации квиза:', error);
        setIsSessionLoading(false);
        isInitializingRef.current = false;
      }
    };

    initializeQuiz();
  }, [id, dispatch, setAttemptId, resetCounter, refetchQuiz]);

  // ============================================================
  // ПОДТВЕРЖДЕНИЕ ОТВЕТА 
// ============================================================
const handleConfirmAnswer = async () => {
  if (isSubmitting || !currentQuestion || !selectedOption) return;
  setIsSubmitting(true);

  try {
    const isCorrect = currentQuestion.correctOptionId === selectedOption;
    const currentActiveId = attemptId || reduxAttemptId;

    const answerData: any = {
      quizId: id,
      questionId: currentQuestion.id,
      selectedOptionId: selectedOption,
      isCorrect,
      questionText: currentQuestion.text,
      correctOptionId: currentQuestion.correctOptionId,
    };

    if (!currentActiveId) {
      answerData.questionOrder = questionOrder;
    }

    const result = await saveStep(currentActiveId, answerData);

    if (result?.attempt?.id) {
      setAttemptId(result.attempt.id);
    }
    // ✅ Обновляем Redux (confirmAnswer)
    dispatch(confirmAnswer());
  } catch (error) {
    console.error('❌ Ошибка сохранения ответа:', error);
  } finally {
    setIsSubmitting(false);
  }
};

  // ============================================================
  // ФИНИШ
  // ============================================================
  if (isFinished) {
    const finalAttemptId = attemptId || reduxAttemptId;
    if (!finalAttemptId) {
      return <QuizSkeleton />;
    }
    return (
      <QuizFinishScreen
        id={id}
        score={score}
        total={questions.length}
        quizData={quizData}
        favoriteIds={favoriteIds}
        onToggleFavorite={(quizId, quiz) =>
          toggleFavorite({ quizId, quiz }).unwrap()
        }
        onReset={async () => {
          if (attemptId) {
            await fetch(`/api/attempts/${attemptId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ forceComplete: true }),
            });
          }
          setIsSessionLoading(true);
          dispatch(resetQuiz());
          setAttemptId(null);
          isInitializingRef.current = false;
          setResetCounter((prev) => prev + 1);
          await refetchQuiz();
        }}
        onRedirect={() => setRedirecting(true)}
        attemptId={attemptId || reduxAttemptId || undefined}
      />
    );
  }

  // ============================================================
  // ЗАГРУЗКА
  // ============================================================
  if (quizLoading || isSessionLoading || !currentQuestion || isFetching) {
    return <QuizSkeleton />;
  }

  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id);
  const isCurrentConfirmed = !!currentAnswer;
  const optionLetters = ['A', 'B', 'C', 'D'];
  const hasExplanation = currentQuestion?.explanation ?? false;

  if (redirecting) {
    return (
      <div className="min-h-screen bg-(--loom-black) flex items-center justify-center">
        <Skeleton className="h-full w-full rounded-xl" />
      </div>
    );
  }

  // ============================================================
  // РЕНДЕР
  // ============================================================
  return (
    <div
      className={`min-h-screen bg-(--loom-black) pb-24 flex flex-col items-center mx-auto overflow-hidden ${
        hideNavigation ? 'pt-10' : 'pt-16'
      }`}
    >
      <div className="w-full max-w-2xl px-4 mb-6">
        {currentQuiz && (
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1
              className="font-bold text-(--loom-cyan) text-center mb-2 text-xl"
              style={{
                maxHeight: '60px',
                overflow: 'hidden',
                wordBreak: 'break-word',
              }}
            >
              {currentQuiz.title}
            </h1>
          </div>
        )}

        <div className="flex items-center gap-4 text-(--loom-white)/60 text-sm mb-2">
          <span className="whitespace-nowrap">
            Вопрос {currentIndex + 1} из {questions.length}
          </span>
          <div className="flex-1 h-1 bg-(--loom-white)/10 rounded-full overflow-hidden min-w-10">
            <div
              className="h-full bg-(--loom-cyan) transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-(--loom-cyan) font-semibold whitespace-nowrap">
            {Math.round(((currentIndex + 1) / questions.length) * 100)}%
          </span>
        </div>
      </div>

      <div className="w-full max-w-2xl px-4">
        <QuizQuestion
          question={currentQuestion}
          currentAnswer={currentAnswer}
          selectedOption={selectedOption}
          onSelectOption={(optionId) => dispatch(selectOption(optionId))}
          onConfirm={handleConfirmAnswer}
          onNext={() => dispatch(nextQuestion())}
          onFinish={() => dispatch(finishQuiz())}
          isLast={currentIndex === questions.length - 1}
          currentIndex={currentIndex}
          total={questions.length}
          optionLetters={optionLetters}
          isPWA={hideNavigation}
          isSubmitting={isSubmitting} // ← передаём состояние в кнопку
        />
      </div>

      {isCurrentConfirmed && hasExplanation && (
        <button
          onClick={() => setSelectedExplanation(currentQuestion.explanation ?? null)}
          className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-13 h-10 rounded-full bg-(--loom-cyan)/10 hover:bg-(--loom-cyan)/20 text-(--loom-cyan) text-lg transition-colors border border-(--loom-cyan)/20 shadow-lg"
        >
          💡
        </button>
      )}

      {selectedExplanation && (
        <Modal
          isOpen={!!selectedExplanation}
          onClose={() => setSelectedExplanation(null)}
          title="Объяснение"
        >
          <p className="text-(--loom-white)/80 leading-relaxed">{selectedExplanation}</p>
        </Modal>
      )}
    </div>
  );
}