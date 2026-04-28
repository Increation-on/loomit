'use client';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectCurrentQuestion, 
  selectScore, 
  selectProgress, 
  selectIsAnswered,
  selectQuizState, 
  startQuiz
} from '@/store/slices/quizSlice';
import { answerQuestion, nextQuestion, previousQuestion, finishQuiz } from '@/store/slices/quizSlice';
import { Button } from '@/components/ui/core/Button';
import { RadioGroup } from '@/components/ui/selection/RadioGroup';
import { ProgressBar } from '@/components/ui/feedback/ProgressBar';
import { useSaveAttemptMutation } from '@/store/api/attemptsApi';
import { useEffect } from 'react';

export function QuizContent({ id }: { id: string }) {
  const dispatch = useDispatch();
  const currentQuestion = useSelector(selectCurrentQuestion);
  const score = useSelector(selectScore);
  const progress = useSelector(selectProgress);
  const isAnswered = useSelector(selectIsAnswered);
  const { questions, answers, currentIndex, isFinished, currentQuiz } = useSelector(selectQuizState);
  const [saveAttempt] = useSaveAttemptMutation();

  // Сохранение после завершения
  useEffect(() => {
    if (isFinished && questions.length > 0) {
      const attempt = {
        quizId: currentQuestion?.id,
        score: answers.filter(a => a.isCorrect).length,
        totalQuestions: questions.length,
        answers: answers,
      };
      saveAttempt(attempt);
    }
  }, [isFinished, questions, answers, currentQuestion, saveAttempt]);

  // Загрузка квиза только если нет вопросов
  useEffect(() => {
    if (questions.length === 0) {
      fetch(`/api/quizzes/${id}`)
        .then(res => res.json())
        .then(quiz => {
          dispatch(startQuiz({
            quiz: { id: quiz.id, title: quiz.title },
            questions: quiz.questions,
          }));
        });
    }
  }, [id, dispatch, questions.length]);

  if (isFinished) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold text-loom-white mb-4">Квиз завершён!</h2>
        <p className="text-loom-white/80">Результат: {score} из {questions.length}</p>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id)?.selectedOptionId;

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <ProgressBar current={currentIndex + 1} total={questions.length} showPercentage />

      <h2 className="text-xl font-bold text-loom-white">{currentQuestion.text}</h2>

      <RadioGroup
        name={`question-${currentQuestion.id}`}
        value={currentAnswer || ''}
        onChange={(val) => dispatch(answerQuestion({ questionId: currentQuestion.id, selectedOptionId: val }))}
      >
        {currentQuestion.options.map((opt, idx) => (
          <RadioGroup.Item key={idx} value={opt}>{opt}</RadioGroup.Item>
        ))}
      </RadioGroup>

      <div className="flex justify-between gap-4 pt-4">
        <Button onClick={() => dispatch(previousQuestion())} disabled={currentIndex === 0}>
          Назад
        </Button>
        {currentIndex === questions.length - 1 ? (
          <Button onClick={() => dispatch(finishQuiz())}>Завершить</Button>
        ) : (
          <Button onClick={() => dispatch(nextQuestion())} disabled={!isAnswered}>
            Далее
          </Button>
        )}
      </div>
    </div>
  );
}