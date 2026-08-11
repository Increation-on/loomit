//src\components\features\QuizContent.tsx

'use client';

import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentQuestion,
  selectScore,
  selectSelectedOption,
  selectQuizState,
  startQuiz,
  resetQuiz,
  selectOption,
  confirmAnswer,
  nextQuestion,
  finishQuiz,
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
import { useQuizFontSize } from '@/hooks/useQuizFontSize';


export function QuizContent({ id }: { id: string }) {
  const dispatch = useDispatch();
  const currentQuestion = useSelector(selectCurrentQuestion);
  const score = useSelector(selectScore);
  const selectedOption = useSelector(selectSelectedOption);
  const { questions, answers, currentIndex, isFinished, currentQuiz } = useSelector(selectQuizState);
  const savedRef = useRef(false);
  const { data: quizData, isLoading: quizLoading } = useGetQuizByIdQuery(id, { skip: !!currentQuiz });
  const { data: session } = useSession();
  const { data: favorites = [] } = useGetFavoritesQuery(undefined, { skip: !session });
  const [toggleFavorite] = useToggleFavoriteMutation();
  const { redirecting, setRedirecting } = useQuizNavigation();
  const { attemptId, save } = useSaveAttempt(id);
  const hideNavigation = usePWA();

  const favoriteIds = useMemo(
    () => new Set(favorites.map((fav) => fav.quiz.id)),
    [favorites]
  );

  const [selectedExplanation, setSelectedExplanation] = useState<string | null>(null);

  const questionTexts = useMemo(
    () => questions.map((question) => question.text),
    [questions]
  );

  const titleTexts = useMemo(
    () => (currentQuiz ? [currentQuiz.title] : []),
    [currentQuiz?.title]
  );

  const optionTexts = useMemo(
    () => currentQuestion?.options?.map((option) => option.text) ?? [],
    [currentQuestion]
  );

  const {
    fontSizes: optionFontSizes,
    ready: optionFontReady,
  } = useQuizFontSize({
    texts: optionTexts,
    containerHeight: 36,
    horizontalPadding: 32,
    minFontSize: 12,
    maxFontSize: 18,
  });

  const {
    fontSize: questionFontSize,
    ready: questionFontReady,
  } = useQuizFontSize({
    texts: questionTexts,
    containerHeight: 112,
    horizontalPadding: 24,
    minFontSize: 16,
    maxFontSize: 28,
  });

  const {
    fontSize: titleFontSize,
    ready: titleFontReady,
  } = useQuizFontSize({
    texts: titleTexts,
    containerHeight: 60,
    horizontalPadding: 24,
    minFontSize: 18,
    maxFontSize: 28,
  });

  useEffect(() => {
    if (currentQuiz && currentQuiz.id !== id) {
      persistor.purge();
      dispatch(resetQuiz());
      savedRef.current = false;
    }
  }, [id, currentQuiz, dispatch]);

  useEffect(() => {
    if (quizData && !currentQuiz) {
      dispatch(startQuiz({
        quiz: { id: quizData.id, title: quizData.title },
        questions: quizData.questions,
      }));
    }
  }, [quizData, currentQuiz, dispatch]);

  useEffect(() => {
    if (isFinished && questions.length > 0 && !savedRef.current) {
      const score = answers.filter(a => a.isCorrect).length;
      save(answers, score, questions.length);
      savedRef.current = true;
    }
  }, [isFinished, questions, answers, save]);

  if (isFinished) {
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
        onReset={() => dispatch(resetQuiz())}
        onRedirect={() => setRedirecting(true)}
        attemptId={attemptId}
      />
    );
  }

  const shouldShowSkeleton =
    !currentQuestion ||
    !questionFontReady ||
    questionFontSize === null ||
    !titleFontReady ||
    titleFontSize === null ||
    !optionFontReady;

  if (shouldShowSkeleton) {
    return <QuizSkeleton />;
  }

  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
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

  return (
    <div className={`min-h-screen bg-(--loom-black) pb-24 flex flex-col items-center mx-auto ${hideNavigation ? 'pt-10' : 'pt-16'}`}>
      <div className="w-full max-w-2xl px-4 mb-6">
        {currentQuiz && (
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1
              className="font-bold text-(--loom-cyan) text-center mb-2"
              style={{
                fontSize: `${titleFontSize}px`,
                lineHeight: '1.2',
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
          <span className="whitespace-nowrap">Вопрос {currentIndex + 1} из {questions.length}</span>
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
          questionFontSize={questionFontSize}
          optionFontSizes={optionFontSizes}
          currentAnswer={currentAnswer}
          selectedOption={selectedOption}
          onSelectOption={(optionId) => dispatch(selectOption(optionId))}
          onConfirm={() => dispatch(confirmAnswer())}
          onNext={() => dispatch(nextQuestion())}
          onFinish={() => dispatch(finishQuiz())}
          isLast={currentIndex === questions.length - 1}
          currentIndex={currentIndex}
          total={questions.length}
          optionLetters={optionLetters}
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
          <p className="text-(--loom-white)/80 leading-relaxed">
            {selectedExplanation}
          </p>
        </Modal>
      )}
    </div>
  );
}