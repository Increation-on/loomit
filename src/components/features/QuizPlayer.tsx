'use client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { answerQuestion, nextQuestion, previousQuestion, finishQuiz } from '@/store/slices/quizSlice';
import { Button } from '@/components/ui/core/Button';
import { RadioGroup } from '@/components/ui/selection/RadioGroup';
import { ProgressBar } from '@/components/ui/feedback/ProgressBar';

export function QuizPlayer() {
  const dispatch = useDispatch();
  const { questions, answers, currentIndex, isFinished } = useSelector((state: RootState) => state.quiz);
  const currentQ = questions[currentIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQ?.id)?.selectedOptionId;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  if (isFinished) {
    const score = answers.filter(a => a.isCorrect).length;
    return (
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold text-loom-white mb-4">Квиз завершён!</h2>
        <p className="text-loom-white/80">Результат: {score} из {questions.length}</p>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <ProgressBar current={currentIndex + 1} total={questions.length} showPercentage />

      <h2 className="text-xl font-bold text-loom-white">{currentQ.text}</h2>

      <RadioGroup
        name={`question-${currentQ.id}`}
        value={currentAnswer || ''}
        onChange={(val) => dispatch(answerQuestion({ questionId: currentQ.id, selectedOptionId: val }))}
      >
        {currentQ.options.map((opt, idx) => (
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
          <Button onClick={() => dispatch(nextQuestion())} disabled={!currentAnswer}>
            Далее
          </Button>
        )}
      </div>
    </div>
  );
}