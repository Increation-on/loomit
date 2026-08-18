// src/components/features/QuizFinishScreen.tsx

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/core/Button';
import { StarButton } from '@/components/ui/core/StarButton';
import { useNavigationTransition } from '../layout/NavigationProvider';

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

  return (
    <div className="min-h-screen bg-(--loom-black) flex flex-col items-center justify-center p-6 text-center space-y-6 -mt-18">
      <h2 className="text-4xl font-bold text-(--loom-yellow) glitch-text" data-text="Квиз завершён! mt-">
        Квиз завершён!
      </h2>

      <div className="text-(--loom-white) text-6xl font-bold">
        {score} <span className="text-2xl text-(--loom-white)/60">/ {total}</span>
      </div>

      {quizData && (
        <div className="flex flex-col items-center gap-2 mt-2">
          <div
            onClick={() => onToggleFavorite(quizData.id, quizData)}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-(--loom-white)/5 hover:bg-(--loom-white)/10 border border-(--loom-white)/10 transition-all cursor-pointer text-(--loom-white)/80 hover:text-(--loom-white) min-w-45 justify-center"
          >
            <StarButton
              active={favoriteIds.has(quizData.id)}
              size={20}
              className="text-(--loom-yellow)! hover:scale-110 transition-transform"
              onClick={() => onToggleFavorite(quizData.id, quizData)}
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
            onReset();
            router.push(`/quiz/${id}`);
          }}
          className="flex-1 bg-(--loom-yellow) text-black font-bold py-3 rounded-xl hover:opacity-90 transition"
        >
          Пройти заново
        </Button>

        <Button
          onClick={() => {
            onReset();
            onRedirect();
          }}
          className="flex-1 bg-(--loom-white)/10 text-(--loom-white) py-3 rounded-xl border border-(--loom-white)/20 hover:bg-(--loom-white)/20 transition"
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
          className="flex-1 py-3 rounded-xl text-base"
        >
          Разобрать ответы
        </Button>
      </div>
    </div>
  );
}