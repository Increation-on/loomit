'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
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
import { Button } from '@/components/ui/core/Button';
import { useSaveAttemptMutation } from '@/store/api/attemptsApi';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { persistor } from '@/store/store';
import { useGetQuizByIdQuery } from '@/store/api/quizApi';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/feedback/ToastContainer';
import { Check, X } from 'lucide-react';
import { useGetFavoritesQuery, useToggleFavoriteMutation } from '@/store/api/favoritesApi';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/feedback/Skeleton';
import { usePWA } from '@/hooks/usePWA';
import { QuizFinishScreen } from './QuizFinishScreen';
import { Modal } from '@/components/ui/feedback/Modal';
import { QuizOption } from './QuizOption';
import { useSaveAttempt } from '@/hooks/useSaveAttempt';
import { useQuizNavigation } from '@/hooks/useQuizNavigation';

export function QuizContent({ id }: { id: string }) {
  const dispatch = useDispatch();
  const router = useRouter();
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

  if (!currentQuestion) return null;

  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
  const isCurrentConfirmed = !!currentAnswer;
  const optionLetters = ['A', 'B', 'C', 'D'];

  // ✅ Вычисляем, правильный ли текущий вопрос и есть ли объяснение
  const isCurrentCorrect = currentAnswer?.isCorrect ?? false;
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
      <div className="w-full mb-6">
        {currentQuiz && (
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-(--loom-cyan) text-center mb-2">
              {currentQuiz.title}
            </h1>
          </div>
        )}

        <div className="flex items-center gap-4 text-(--loom-white)/60 text-sm mb-2">
          <span>Вопрос {currentIndex + 1} из {questions.length}</span>
          <div className="flex-1 h-1 bg-(--loom-white)/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-(--loom-cyan) transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-(--loom-cyan) font-semibold">
            {Math.round(((currentIndex + 1) / questions.length) * 100)}%
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="w-full space-y-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-(--loom-white) leading-tight">
            {currentQuestion.text}
          </h2>

          <div className="flex flex-col gap-3 w-full mx-auto">
            {currentQuestion.options.map((opt: any, idx: number) => {
              if (!opt || typeof opt !== 'object') return null;

              const isSelected = selectedOption === opt.id;
              const isCorrectOption = currentQuestion.correctOptionId === opt.id;

              let borderClass = 'border-(--loom-white)/10 hover:border-(--loom-cyan)/40';
              let letterClass = 'font-bold bg-gradient-to-r from-(--loom-yellow) to-(--loom-cyan) bg-clip-text text-transparent';
              let textClass = 'text-(--loom-white)/70';
              let icon = null;

              if (isSelected && !isCurrentConfirmed) {
                borderClass = 'glitch-border';
                letterClass = 'text-(--loom-yellow) font-bold';
                textClass = 'text-(--loom-yellow)';
              }

              if (isCurrentConfirmed) {
                if (isCorrectOption) {
                  borderClass = 'border-(--loom-cyan)';
                  letterClass = 'text-(--loom-cyan) font-bold';
                  textClass = 'text-(--loom-cyan)';
                  icon = <Check size={18} className="text-(--loom-cyan) ml-auto" />;
                } else if (currentAnswer?.selectedOptionId === opt.id && !currentAnswer?.isCorrect) {
                  borderClass = 'border-(--glitch-pink)';
                  letterClass = 'text-(--glitch-pink) font-bold';
                  textClass = 'text-(--glitch-pink)/80';
                  icon = <X size={18} className="text-(--glitch-pink) ml-auto" />;
                }
              }

              return (
                <QuizOption
                  key={idx}
                  letter={optionLetters[idx]}
                  text={opt.text}
                  isSelected={isSelected}
                  isCurrentConfirmed={isCurrentConfirmed}
                  isCorrect={isCorrectOption}
                  isWrong={currentAnswer?.selectedOptionId === opt.id && !currentAnswer?.isCorrect}
                  icon={icon}
                  onClick={() => {
                    if (!isCurrentConfirmed) {
                      dispatch(selectOption(opt.id));
                    }
                  }}
                />
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-2 pt-8">
            {!isCurrentConfirmed ? (
              <Button
                variant="glitch"
                onClick={() => dispatch(confirmAnswer())}
                disabled={!selectedOption}
                className="px-12 py-2.5 text-base"
              >
                Ответить
              </Button>
            ) : currentIndex === questions.length - 1 ? (
              <Button
                variant="glitch"
                onClick={() => dispatch(finishQuiz())}
                className="px-12 py-2.5 text-base"
              >
                Завершить
              </Button>
            ) : (
              <Button
                variant="glitch"
                onClick={() => dispatch(nextQuestion())}
                className="px-12 py-2.5 text-base"
              >
                Далее
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ✅ Лампочка в правом нижнем углу экрана */}
      {isCurrentConfirmed && hasExplanation && (
        <button
          onClick={() => setSelectedExplanation(currentQuestion.explanation ?? null)}
          className="fixed bottom-4 right-4 z-40 flex items-center justify-center w-13 h-10 rounded-full bg-(--loom-cyan)/10 hover:bg-(--loom-cyan)/20 text-(--loom-cyan) text-lg transition-colors border border-(--loom-cyan)/20 shadow-lg"
        >
          💡
        </button>
      )}

      {/* ✅ Модалка с объяснением */}
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