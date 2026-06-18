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
  previousQuestion,
  finishQuiz,
} from '@/store/slices/quizSlice';
import { Button } from '@/components/ui/core/Button';
import { useSaveAttemptMutation } from '@/store/api/attemptsApi';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { persistor } from '@/store/store';
import { useGetQuizByIdQuery } from '@/store/api/quizApi';
import { useSession } from 'next-auth/react';
import { useToast } from '../ui/feedback/ToastContainer';
import { ArrowRight, Check, X } from 'lucide-react';

export function QuizContent({ id }: { id: string }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentQuestion = useSelector(selectCurrentQuestion);
  const score = useSelector(selectScore);
  const selectedOption = useSelector(selectSelectedOption);
  const { questions, answers, currentIndex, isFinished, currentQuiz } = useSelector(selectQuizState);
  const [saveAttempt] = useSaveAttemptMutation();
  const savedRef = useRef(false);
  const { data: quizData } = useGetQuizByIdQuery(id, { skip: !!currentQuiz });
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const { warning } = useToast();

  // Загрузка квиза (без изменений)
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

  // Сохранение (без изменений)
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

  // Экран результатов (стилизован)
  if (isFinished) {
    return (
      <div className="min-h-screen bg-(--loom-black) flex flex-col items-center justify-center p-6 text-center space-y-6">
        <h2 className="text-4xl font-bold text-(--loom-yellow) glitch-text" data-text="Квиз завершён!">
          Квиз завершён!
        </h2>
        <div className="text-(--loom-white) text-6xl font-bold">
          {score} <span className="text-2xl text-(--loom-white)/60">/ {questions.length}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <Button
            onClick={() => { dispatch(resetQuiz()); router.push(`/quiz/${id}`); }}
            className="flex-1 bg-(--loom-yellow) text-black font-bold py-3 rounded-xl hover:opacity-90 transition"
          >
            Пройти заново
          </Button>
          <Button
            onClick={() => { dispatch(resetQuiz()); router.push('/'); }}
            className="flex-1 bg-(--loom-white)/10 text-(--loom-white) py-3 rounded-xl border border-(--loom-white)/20 hover:bg-(--loom-white)/20 transition"
          >
            На главную
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
  const isCurrentConfirmed = !!currentAnswer;
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-(--loom-black) pt-8 pb-24 px-4 flex flex-col items-center max-w-2xl mx-auto">

      {/* Прогресс и заголовок квиза */}
      <div className="w-full mb-6">
        {currentQuiz && (
          <h1 className="text-2xl font-bold text-(--loom-cyan) text-center mb-2">{currentQuiz.title}</h1>
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

      {/* Вопрос и варианты */}
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
            {currentQuestion.options.map((opt: string, idx: number) => {
              const isSelected = selectedOption === opt;
              const isCorrectOption = currentQuestion.correctOptionId === opt;

              let borderClass = 'border-(--loom-white)/20 hover:border-(--loom-cyan)/50';
              let bgClass = 'bg-(--loom-white)/5';
              let letterClass = 'text-(--loom-cyan) font-bold';
              let textClass = 'text-(--loom-white)';
              let icon = null;

              if (isCurrentConfirmed) {
                if (isCorrectOption) {
                  borderClass = 'border-green-500';
                  letterClass = 'text-green-300 font-bold';
                  textClass = 'text-green-300';
                  icon = <Check size={20} className="text-green-500 ml-auto" />;
                } else if (currentAnswer?.selectedOptionId === opt && !currentAnswer?.isCorrect) {
                  borderClass = 'border-red-500';
                  letterClass = 'text-red-300 font-bold';
                  textClass = 'text-red-300';
                  icon = <X size={20} className="text-red-500 ml-auto" />;
                }
              } else if (isSelected) {
                borderClass = 'border-(--loom-purple)';           // ✅ Рамка: фиолетовая
                letterClass = 'text-(--loom-yellow) font-bold';    // Буква: жёлтая
                textClass = 'text-(--loom-cyan)';                  // Текст: циан
              }

              return (
                <motion.div
                  key={idx}
                  whileHover={!isCurrentConfirmed ? { scale: 1.01 } : {}}
                  whileTap={!isCurrentConfirmed ? { scale: 0.98 } : {}}
                  onClick={() => {
                    if (!isCurrentConfirmed) {
                      dispatch(selectOption(opt));
                    }
                  }}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${borderClass} ${bgClass}`}
                >
                  <span className={`text-lg font-bold w-6 ${letterClass}`}>{optionLetters[idx]}</span>
                  <span className={`flex-1 ${textClass}`}>{opt}</span>
                  {icon}
                </motion.div>
              );
            })}
          </div>

          {/* Кнопки управления */}
          <div className="flex flex-col gap-3 pt-4">
            {!isCurrentConfirmed ? (
              <Button
                onClick={() => dispatch(confirmAnswer())}
                disabled={!selectedOption}
                className="w-full bg-(--loom-yellow) text-black font-bold text-lg py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50"
              >
                Ответить
              </Button>
            ) : currentIndex === questions.length - 1 ? (
              <Button
                onClick={() => dispatch(finishQuiz())}
                className="w-full bg-(--loom-yellow) text-black font-bold text-lg py-4 rounded-xl hover:opacity-90 transition"
              >
                Завершить
              </Button>
            ) : (
              <Button
                onClick={() => dispatch(nextQuestion())}
                className="w-full bg-(--loom-yellow) text-black font-bold text-lg py-4 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                Далее <ArrowRight size={20} />
              </Button>
            )}

            {isCurrentConfirmed && (
              <Button
                onClick={() => dispatch(previousQuestion())}
                disabled={currentIndex === 0}
                className="w-full bg-(--loom-white)/10 text-(--loom-white) py-3 rounded-xl hover:bg-(--loom-white)/20 transition disabled:opacity-50"
              >
                Назад
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}