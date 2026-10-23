'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { quizApi } from '@/store/api/quizApi';

import { useGetQuizByIdQuery } from '@/store/api/quizApi';
import { useGetFavoritesQuery, useToggleFavoriteMutation } from '@/store/api/favoritesApi';

import { Button } from '@/components/ui/core/Button';
import { Skeleton } from '@/components/ui/feedback/Skeleton';
import { cn } from '@/lib/utils';
import { StarButton } from '@/components/ui/core/StarButton';
import { useQuizFontSize } from '@/hooks/useQuizFontSize';
import { Modal } from '@/components/ui/feedback/Modal';
import { resetQuiz } from '@/store/slices/quizSlice';
import { usePageHeader } from '@/hooks/usePageHeader';
import { PageContentTitle } from '@/components/ui/core/PageContentTitle';
import { InlineCodeText } from '@/components/ui/core/InlineCodeText';

export default function QuizPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const id = params.id as string;

  const { data: session } = useSession();

  const {
    data: quiz,
    isLoading,
    isFetching,
    refetch,
  } = useGetQuizByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const { data: favorites = [] } = useGetFavoritesQuery(undefined, { skip: !session });
  const [toggleFavorite] = useToggleFavoriteMutation();

  const [isCurrentModalOpen, setIsCurrentModalOpen] = useState(false);
  const [isOtherModalOpen, setIsOtherModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const hasCurrentAttempt = !!quiz?.activeAttemptId;
  const favoriteIds = useMemo(() => new Set(favorites.map((fav) => fav.quiz.id)), [favorites]);

  const {
    fontSize: descriptionFontSize,
    isReady,
    ref: descriptionCallbackRef,
  } = useQuizFontSize({
    text: quiz?.description || '',
    minFontSize: 12,
    maxFontSize: 18,
    step: 0.5,
    mode: 'dom',
    dependencies: [quiz?.id, quiz?.description],
  });

  usePageHeader({ variant: 'tab', title: 'Предпросмотр', showBack: true });

  const handleStartClick = () => {
    if (!quiz) return;

    if (quiz.activeAttemptId) {
      setIsCurrentModalOpen(true);
    } else if (quiz.otherAttempt) {
      setIsOtherModalOpen(true);
    } else {
      dispatch(resetQuiz());
      router.push(`/quiz/${id}`);
    }
  };

  const handleForceReset = async (attemptIdToClose: string) => {
    setIsResetting(true);
    try {
      const res = await fetch(`/api/attempts/${attemptIdToClose}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceComplete: true }),
      });

      if (res.ok) {
        setIsCurrentModalOpen(false);
        setIsOtherModalOpen(false);

        dispatch(quizApi.util.invalidateTags([{ type: 'Quiz', id }]));
        await refetch();
        router.push(`/quiz/${id}`);
      }
    } catch (error) {
      console.error('[FE-RESET] Ошибка:', error);
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetCurrentQuiz = async () => {
    const attemptId = quiz?.activeAttemptId;
    if (!attemptId) return;
    await handleForceReset(attemptId);
  };

  const handleResetOtherQuiz = async () => {
    const attemptId = quiz?.otherAttempt?.id;
    if (!attemptId) return;
    await handleForceReset(attemptId);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="mx-auto h-10 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <p className="text-(--loom-white)/60">Квиз не найден</p>
      </div>
    );
  }

  const levelColors = {
    JUNIOR: 'text-(--loom-cyan)',
    MIDDLE: 'text-(--loom-yellow)',
    SENIOR: 'text-(--glitch-pink)',
  };

  return (
    <div className="flex min-h-[80vh] flex-col p-4">
      
      <div className="w-full max-w-md">
        <PageContentTitle 
          title="Предпросмотр квиза" 
          showBack={true} 
          fallback="/catalog" 
          className="mt-3 mb-0" 
        />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="glitch-border relative w-full max-w-md overflow-hidden rounded-2xl bg-(--loom-white)/5 p-7">
          <div className="pointer-events-none absolute inset-0">
            <div className="glitch-scanline-gradient animate-scanline absolute right-0 left-0 mx-auto h-0.75 w-full opacity-50 blur-[1px]" />
          </div>

          <div className="relative z-10 space-y-4 text-center">
            <div className="flex justify-center">
              {quiz.category?.iconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={quiz.category.iconUrl}
                  alt={quiz.category.name}
                  className="h-18 w-18 rounded-full object-contain"
                />
              ) : (
                <div className="flex h-18 w-18 items-center justify-center rounded-full bg-(--loom-cyan)/20 text-2xl font-bold text-(--loom-cyan)">
                  {quiz.category?.name?.[0] || '?'}
                </div>
              )}
            </div>

            <h1 className="text-xl font-bold text-(--loom-white)">{quiz.title}</h1>

            <div className="flex justify-center">
              <StarButton
                active={favoriteIds.has(quiz.id)}
                onClick={() => toggleFavorite({ quizId: quiz.id, quiz }).unwrap()}
                size={30}
              />
            </div>

            {quiz.description && (
              <div className="relative flex max-h-25 w-full items-center justify-center overflow-hidden">
                <p
                  ref={descriptionCallbackRef}
                  className="w-full text-center wrap-break-word text-(--loom-white)/60"
                  style={{
                    fontSize: `${descriptionFontSize}px`,
                    lineHeight: '1.4',
                    visibility: isReady ? 'visible' : 'hidden',
                  }}
                >
                  <InlineCodeText value={quiz.description} fontSize={descriptionFontSize} />
                </p>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <span className="font-medium text-(--loom-magenta)">
                {quiz.category?.name || 'Без категории'}
              </span>
              <span className="text-(--loom-white)/30">•</span>
              <span
                className={cn(
                  'font-semibold',
                  levelColors[quiz.level as keyof typeof levelColors] || 'text-(--loom-white)/60'
                )}
              >
                {quiz.level
                  ? quiz.level.charAt(0) + quiz.level.slice(1).toLowerCase()
                  : 'Любой уровень'}
              </span>
              <span className="text-(--loom-white)/30">•</span>
              <span className="text-(--loom-white)/60">{quiz.questions?.length || 0} вопросов</span>
            </div>

            <div className="pt-2">
              <Button
                variant="glitch"
                onClick={handleStartClick}
                disabled={isResetting}
                className="w-full py-2.5 text-sm"
              >
                {isFetching
                  ? 'Обновление данных...'
                  : hasCurrentAttempt
                    ? 'Продолжить квиз'
                    : 'Начать квиз'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCurrentModalOpen}
        onClose={() => !isResetting && setIsCurrentModalOpen(false)}
        title="У вас есть незавершенная попытка"
      >
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-(--loom-white)/80">
            Вы уже начинали проходить этот квиз ранее. Хотите продолжить с того места, где
            остановились, или начать заново?
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="glitch"
              disabled={isResetting}
              onClick={() => {
                setIsCurrentModalOpen(false);
                router.push(`/quiz/${id}`);
              }}
              className="w-full py-2 text-sm"
            >
              Продолжить прохождение
            </Button>
            <Button
              variant="outline"
              disabled={isResetting}
              onClick={handleResetCurrentQuiz}
              className="w-full border-red-500/30 py-2 text-sm text-red-500 hover:bg-red-500/10"
            >
              {isResetting ? 'Сброс...' : 'Начать заново (стереть прогресс)'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isOtherModalOpen}
        onClose={() => !isResetting && setIsOtherModalOpen(false)}
        title="Обнаружен другой активный квиз"
      >
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-(--loom-white)/80">
            У вас уже есть незавершенный квиз{' '}
            <span className="font-semibold text-(--loom-cyan)">
              «{quiz.otherAttempt?.quizTitle}»
            </span>
            . Чтобы начать этот, вам необходимо сбросить текущий прогресс другого квиза, либо
            вернуться и завершить его.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="glitch"
              disabled={isResetting}
              onClick={() => {
                setIsOtherModalOpen(false);
                router.push(`/quiz/${quiz.otherAttempt?.quizId}`);
              }}
              className="w-full py-2 text-sm"
            >
              Вернуться к «{quiz.otherAttempt?.quizTitle}»
            </Button>
            <Button
              variant="outline"
              disabled={isResetting}
              onClick={handleResetOtherQuiz}
              className="w-full py-2 text-sm"
            >
              {isResetting ? 'Сброс...' : 'Сбросить старый и начать этот'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
