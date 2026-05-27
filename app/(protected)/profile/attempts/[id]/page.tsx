'use client';

import { useParams } from 'next/navigation';
import { useGetAttemptByIdQuery } from '@/store/api/profileApi';

export default function AttemptDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: attempt, isLoading } = useGetAttemptByIdQuery(id);

  if (isLoading) return <p className="text-loom-white p-4">Загрузка...</p>;
  if (!attempt) return <p className="text-loom-white p-4">Попытка не найдена</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-loom-white mb-2">{attempt.quizTitle}</h1>
      <p className="text-loom-white/60 mb-6">
        Результат: {attempt.score}/{attempt.totalQuestions} ({Math.round(attempt.score / attempt.totalQuestions * 100)}%) · {new Date(attempt.createdAt).toLocaleDateString('ru')}
      </p>

      <div className="space-y-4">
        {attempt.answers?.map((a: any, i: number) => (
          <div key={i} className="p-4 bg-loom-dark-secondary rounded-lg">
            <p className="text-loom-white font-semibold mb-2">{i + 1}. {a.questionText || 'Вопрос'}</p>
            <p className={a.isCorrect ? 'text-green-400' : 'text-red-400'}>
              Ваш ответ: {a.selectedOptionId} {a.isCorrect ? '✓' : '✗'}
            </p>
            {!a.isCorrect && (
              <p className="text-green-400">Правильный: {a.correctOptionId}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}