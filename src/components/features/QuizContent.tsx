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
import { cn } from '@/lib/utils';
import { useGetFavoritesQuery, useToggleFavoriteMutation } from '@/store/api/favoritesApi';
import { useMemo } from 'react';
import { StarButton } from '../ui/core/StarButton';
import { Skeleton } from '@/components/ui/feedback/Skeleton';

export function QuizContent({ id }: { id: string }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentQuestion = useSelector(selectCurrentQuestion);
  const score = useSelector(selectScore);
  const selectedOption = useSelector(selectSelectedOption);
  const { questions, answers, currentIndex, isFinished, currentQuiz } = useSelector(selectQuizState);
  const [saveAttempt] = useSaveAttemptMutation();
  const savedRef = useRef(false);
  const { data: quizData, isLoading: quizLoading } = useGetQuizByIdQuery(id, { skip: !!currentQuiz });
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const { warning } = useToast();
  const { data: session } = useSession();
  const { data: favorites = [] } = useGetFavoritesQuery(undefined, { skip: !session });
  const [toggleFavorite] = useToggleFavoriteMutation();

  const [redirecting, setRedirecting] = useState(false);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((fav) => fav.quiz.id)),
    [favorites]
  );

  useEffect(() => {
    if (redirecting) {
      router.push('/catalog');
    }
  }, [redirecting, router]);

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
      savedRef.current = true;
      const attempt = {
        quizId: id,
        score: answers.filter(a => a.isCorrect).length,
        totalQuestions: questions.length,
        answers: answers,
      };
      saveAttempt(attempt)
        .then(() => console.log('✅ Сохранено успешно'))
        .catch((error) => {
          console.error('Ошибка сохранения:', error);
          if (!isAuthenticated) {
            warning('Нет сети, результат не сохранён');
          }
        });
    }
  }, [isFinished, questions, answers, id, saveAttempt, dispatch]);

  if (isFinished) {
    return (
      <div className="min-h-screen bg-(--loom-black) flex flex-col items-center justify-center p-6 text-center space-y-6">
        <h2 className="text-4xl font-bold text-(--loom-yellow) glitch-text" data-text="Квиз завершён!">
          Квиз завершён!
        </h2>

        <div className="text-(--loom-white) text-6xl font-bold">
          {score} <span className="text-2xl text-(--loom-white)/60">/ {questions.length}</span>
        </div>

        {quizData && (
          <div className="flex flex-col items-center gap-2 mt-2">
            <div
              onClick={() => {
                toggleFavorite({
                  quizId: quizData.id,
                  quiz: quizData,
                }).unwrap();
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-(--loom-white)/5 hover:bg-(--loom-white)/10 border border-(--loom-white)/10 transition-all cursor-pointer text-(--loom-white)/80 hover:text-(--loom-white) min-w-45 justify-center"
            >
              <StarButton
                active={favoriteIds.has(quizData.id)}
                size={20}
                className="text-(--loom-yellow)! hover:scale-110 transition-transform"
                onClick={() => {
                  toggleFavorite({
                    quizId: quizData.id,
                    quiz: quizData,
                  }).unwrap();
                }}
              />
              <span className="text-sm font-medium">
                {favoriteIds.has(quizData.id)
                  ? 'В избранном'
                  : 'Добавить в избранное'}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mt-6">
          <Button
            onClick={() => {
              dispatch(resetQuiz());
              setRedirecting(true);
            }}
            className="flex-1 bg-(--loom-yellow) text-black font-bold py-3 rounded-xl hover:opacity-90 transition"
          >
            Пройти заново
          </Button>
          <Button
            onClick={() => {
              dispatch(resetQuiz());
              setRedirecting(true);
            }}
            className="flex-1 bg-(--loom-white)/10 text-(--loom-white) py-3 rounded-xl border border-(--loom-white)/20 hover:bg-(--loom-white)/20 transition"
          >
            В каталог
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
  const isCurrentConfirmed = !!currentAnswer;
  const optionLetters = ['A', 'B', 'C', 'D'];

  if (redirecting) {
    return (
      <div className="min-h-screen bg-(--loom-black) flex items-center justify-center">
        <Skeleton className="h-full w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--loom-black) pt-8 pb-24 px-4 flex flex-col items-center max-w-2xl mx-auto">
      <div className="w-full mb-6">
        {currentQuiz && quizData && (
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-(--loom-cyan) text-center">
              {currentQuiz.title}
            </h1>
            <StarButton
              active={favoriteIds.has(quizData.id)}
              onClick={() => {
                if (quizData) {
                  toggleFavorite({
                    quizId: quizData.id,
                    quiz: quizData,
                  }).unwrap();
                }
              }}
              size={28}
              className="ml-2"
            />
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

          <div className="space-y-3">
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
                <motion.div
                  key={idx}
                  whileHover={!isCurrentConfirmed ? { scale: 1.01 } : {}}
                  whileTap={!isCurrentConfirmed ? { scale: 0.98 } : {}}
                  onClick={() => {
                    if (!isCurrentConfirmed) {
                      dispatch(selectOption(opt.id));
                    }
                  }}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
                    'bg-(--loom-white)/5',
                    borderClass
                  )}
                >
                  <span className={cn('text-lg font-bold w-6', letterClass)}>{optionLetters[idx]}</span>
                  <span className={cn('flex-1', textClass)}>{opt.text}</span>
                  {icon}
                </motion.div>
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
    </div>
  );
}