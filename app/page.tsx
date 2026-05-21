'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useGetQuizzesQuery } from '@/store/api/quizApi';
import { ResumeQuizButton } from '@/components/features/ResumeQuizButton';
import { QuizCard } from '@/components/features/QuizCard';
import { selectQuizState, resetQuiz } from '@/store/slices/quizSlice';
import { persistor } from '@/store/store';
import { Modal } from '@/components/ui/feedback/Modal';
import { EmptyState } from '@/components/ui/feedback/EmptyState';

export default function Home() {
  const { data: quizzes, isLoading, error } = useGetQuizzesQuery({});
  const router = useRouter();
  const dispatch = useDispatch();
  const quizState = useSelector(selectQuizState);
  const currentQuiz = quizState.currentQuiz;
  const answers = quizState.answers;
  const isFinished = quizState.isFinished;
  const [pendingQuizId, setPendingQuizId] = useState<string | null>(null);

  const hasUnfinished = currentQuiz && answers.length > 0 && !isFinished;
  const isSameQuiz = currentQuiz?.id === pendingQuizId;

  const handleQuizClick = (quizId: string) => {
    if (hasUnfinished) {
      setPendingQuizId(quizId);
    } else {
      router.push(`/quiz/${quizId}`);
    }
  };

  const handleStartNew = async () => {
    await persistor.purge();
    dispatch(resetQuiz());
    if (pendingQuizId) {
      router.push(`/quiz/${pendingQuizId}`);
    }
    setPendingQuizId(null);
  };

  const handleContinue = () => {
    if (isSameQuiz) {
      router.push(`/quiz/${pendingQuizId}`);
    } else {
      router.push(`/quiz/${currentQuiz!.id}`);
    }
    setPendingQuizId(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-loom-white">Каталог квизов</h1>
      <ResumeQuizButton />

      {isLoading && <p className="text-loom-white/60">Загрузка...</p>}
      {error && <p className="text-red-400">Ошибка загрузки</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {quizzes?.map((quiz: any) => (
          <div key={quiz.id} onClick={() => handleQuizClick(quiz.id)}>
            <QuizCard
              id={quiz.id}
              title={quiz.title}
              description={quiz.description ?? ''}
              questionsCount={quiz._count?.questions ?? 0}
            />
          </div>
        ))}
      </div>

      {quizzes && quizzes.length === 0 && (
        <EmptyState
          title="Нет доступных квизов"
          description="Загляните позже, скоро здесь появятся новые квизы."
        />
      )}

      <Modal
        isOpen={!!pendingQuizId}
        onClose={() => setPendingQuizId(null)}
        onCancel={handleStartNew}
        title="Незавершённый квиз"
        cancelText={isSameQuiz ? 'Начать заново' : 'Начать новый квиз'}
        confirmText={isSameQuiz ? 'Продолжить' : `Продолжить «${currentQuiz?.title}»`}
        onConfirm={handleContinue}
      >
        <p>
          У вас есть незавершённый квиз <strong>«{currentQuiz?.title}»</strong>.
        </p>
        <p className="text-sm mt-2 text-gray-500">
          {isSameQuiz
            ? 'Продолжить с последнего вопроса или начать заново?'
            : 'Начать новый квиз или вернуться к старому?'}
        </p>
      </Modal>
    </div>
  );
}