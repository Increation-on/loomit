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
import { RadioGroup } from '@/components/ui/selection/RadioGroup';
import { ProgressBar } from '@/components/ui/feedback/ProgressBar';
import { useSaveAttemptMutation } from '@/store/api/attemptsApi';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { persistor } from '@/store/store';

export function QuizContent({ id }: { id: string }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentQuestion = useSelector(selectCurrentQuestion);
  const score = useSelector(selectScore);
  const selectedOption = useSelector(selectSelectedOption);
  const { questions, answers, currentIndex, isFinished, currentQuiz } = useSelector(selectQuizState);
  const [saveAttempt] = useSaveAttemptMutation();
  const loadedRef = useRef(false);
  const savedRef = useRef(false);

// Загрузка квиза
useEffect(() => {
  const initQuiz = async () => {
    // Если в сторе другой квиз — сбрасываем persist и стейт
    if (currentQuiz && currentQuiz.id !== id) {
      await persistor.purge();
      dispatch(resetQuiz());
      loadedRef.current = false;
      savedRef.current = false;
    }
    
    if (!loadedRef.current && questions.length === 0 && !currentQuiz) {
      loadedRef.current = true;
      fetch(`/api/quizzes/${id}`)
        .then(res => res.json())
        .then(quiz => {
          dispatch(startQuiz({
            quiz: { id: quiz.id, title: quiz.title },
            questions: quiz.questions,
          }));
        });
    }
  };
  initQuiz();
}, [id, currentQuiz, questions.length, dispatch]);

  // Сохранение
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
        .catch((error) => console.error('Ошибка сохранения:', error));
    }
  }, [isFinished, questions, answers, id, saveAttempt, dispatch]);

  if (isFinished) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold text-loom-white mb-4">Квиз завершён!</h2>
        <p className="text-loom-white/80 mb-6">Результат: {score} из {questions.length}</p>
        <Button onClick={() => { dispatch(resetQuiz()); router.push('/'); }}>На главную</Button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
  const isCurrentConfirmed = !!currentAnswer;

  return (
  <div className="p-4 space-y-6 max-w-2xl mx-auto">
    {currentQuiz && (
  <h1 className="text-3xl font-bold text-loom-yellow text-center">{currentQuiz.title}</h1>
)}
      <ProgressBar current={currentIndex + 1} total={questions.length} showPercentage />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold text-loom-white">{currentQuestion.text}</h2>

          <RadioGroup
            name={`question-${currentQuestion.id}`}
            value={selectedOption || ''}
            onChange={(val) => {
              if (!isCurrentConfirmed) {
                dispatch(selectOption(val));
              }
            }}
          >
            {currentQuestion.options.map((opt: string, idx: number) => {
              const isSelected = selectedOption === opt;
              const isCorrectOption = currentQuestion.correctOptionId === opt;
              let optionClass = 'text-loom-white/80';

              if (isCurrentConfirmed) {
                if (isCorrectOption) {
                  optionClass = 'text-green-400 font-semibold';
                } else if (currentAnswer?.selectedOptionId === opt && !currentAnswer?.isCorrect) {
                  optionClass = 'text-red-400 font-semibold';
                }
              }

              return (
                <RadioGroup.Item key={idx} value={opt} disabled={isCurrentConfirmed}>
                  <span className={optionClass}>{opt}</span>
                </RadioGroup.Item>
              );
            })}
          </RadioGroup>

          <div className="flex justify-between gap-4 pt-4">
            <Button onClick={() => dispatch(previousQuestion())} disabled={currentIndex === 0}>
              Назад
            </Button>

            {!isCurrentConfirmed ? (
              <Button onClick={() => dispatch(confirmAnswer())} disabled={!selectedOption}>
                Ответить
              </Button>
            ) : currentIndex === questions.length - 1 ? (
              <Button onClick={() => dispatch(finishQuiz())}>Завершить</Button>
            ) : (
              <Button onClick={() => dispatch(nextQuestion())}>Далее</Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}