// src/components/features/QuizFinishScreen.tsx

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/core/Button';
import { StarButton } from '@/components/ui/core/StarButton';
import { useNavigationTransition } from '@/components/layout/NavigationProvider';

interface QuizFinishScreenProps {
  id: string;
  score: number;
  total: number;
  quizData?: any;
  favoriteIds: Set<string>;
  onToggleFavorite: (quizId: string, quiz: any) => void;
  onReset: () => void;
  onRedirect: () => void;
  attemptId?: string | null;
}

export function QuizFinishScreen({
  id,
  score,
  total,
  quizData,
  favoriteIds,
  onToggleFavorite,
  onReset,
  onRedirect,
  attemptId,
}: QuizFinishScreenProps) {
  const router = useRouter();
  const { setAttemptReturnTo } = useNavigationTransition();

  // Принудительно закрываем попытку при монтировании
  useEffect(() => {
    if (attemptId) {
      fetch(`/api/attempts/${attemptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceComplete: true }),
      }).catch((err) => console.error('❌ Ошибка завершения попытки:', err));
    }
  }, [attemptId]);

  return (
    <div className="-mt-18 flex min-h-screen flex-col items-center justify-center space-y-6 bg-(--loom-black) p-6 text-center">
      <h2
        className="glitch-text text-4xl font-bold text-(--loom-yellow)"
        data-text="Квиз завершён! mt-"
      >
        Квиз завершён!
      </h2>

      <div className="text-6xl font-bold text-(--loom-white)">
        {score} <span className="text-2xl text-(--loom-white)/60">/ {total}</span>
      </div>

      {quizData && (
        <div className="mt-2 flex flex-col items-center gap-2">
          <div
            onClick={() => onToggleFavorite(quizData.id, quizData)}
            className="flex min-w-45 cursor-pointer items-center justify-center gap-2 rounded-full border border-(--loom-white)/10 bg-(--loom-white)/5 px-5 py-2 text-(--loom-white)/80 transition-all hover:bg-(--loom-white)/10 hover:text-(--loom-white)"
          >
            <StarButton
              active={favoriteIds.has(quizData.id)}
              size={20}
              className="text-(--loom-yellow)! transition-transform hover:scale-110"
              onClick={() => onToggleFavorite(quizData.id, quizData)}
            />
            <span className="text-sm font-medium">
              {favoriteIds.has(quizData.id) ? 'В избранном' : 'Добавить в избранное'}
            </span>
          </div>
        </div>
      )}

      <div className="mt-6 flex w-full max-w-sm flex-col gap-4 sm:flex-row">
        <Button
          onClick={() => {
            onReset();
            router.push(`/quiz/${id}`);
          }}
          className="flex-1 rounded-xl bg-(--loom-yellow) py-3 font-bold text-black transition hover:opacity-90"
        >
          Пройти заново
        </Button>

        <Button
          onClick={() => {
            onReset();
            onRedirect();
          }}
          className="flex-1 rounded-xl border border-(--loom-white)/20 bg-(--loom-white)/10 py-3 text-(--loom-white) transition hover:bg-(--loom-white)/20"
        >
          В каталог
        </Button>

        <Button
          variant="glitch"
          onClick={() => {
            if (attemptId && id) {
              setAttemptReturnTo(`/quiz/${id}/preview`);
              router.push(`/profile/attempts/${attemptId}?quizId=${id}`);
            }
          }}
          className="flex-1 rounded-xl py-3 text-base"
        >
          Разобрать ответы
        </Button>
      </div>
    </div>
  );
}
