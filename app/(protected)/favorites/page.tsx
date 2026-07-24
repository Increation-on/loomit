'use client';

import { useSession } from 'next-auth/react';
import { useGetFavoritesQuery, useToggleFavoriteMutation } from '@/store/api/favoritesApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/core/Card';
import { EmptyState } from '@/components/ui/feedback/EmptyState';
import { Skeleton } from '@/components/ui/feedback/Skeleton';
import { useRouter } from 'next/navigation';
import { cn, pluralize } from '@/lib/utils';
import { StarButton } from '@/components/ui/core/StarButton';
import { useState, useEffect, useRef } from 'react';
import { useGetQuizzesQuery } from '@/store/api/quizApi';

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: favorites, isLoading } = useGetFavoritesQuery({}, { skip: !session });
  const [toggleFavorite] = useToggleFavoriteMutation();
  const { data: quizzes } = useGetQuizzesQuery({});

  const [attemptStatuses, setAttemptStatuses] = useState<Record<string, any>>({});
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [localFavorites, setLocalFavorites] = useState<any[]>([]);
  const prevFavoritesRef = useRef<any[]>([]);

  useEffect(() => {
    if (favorites && JSON.stringify(favorites) !== JSON.stringify(prevFavoritesRef.current)) {
      setLocalFavorites(favorites);
      prevFavoritesRef.current = favorites;
    }
  }, [favorites]);

  useEffect(() => {
    if (!quizzes?.length) return;
    const fetchStatuses = async () => {
      const quizIds = quizzes.map((q: any) => q.id);
      const res = await fetch('/api/quizzes/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizIds }),
      });
      const data = await res.json();
      setAttemptStatuses(data);
    };
    fetchStatuses();
  }, [quizzes]);

  const handleRemove = (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (removingIds.has(quizId)) return;

    setRemovingIds((prev) => new Set(prev).add(quizId));
    setLocalFavorites((prev) => prev.filter((fav) => fav.quiz.id !== quizId));

    toggleFavorite(quizId).finally(() => {
      setTimeout(() => {
        setRemovingIds((prev) => {
          const next = new Set(prev);
          next.delete(quizId);
          return next;
        });
      }, 400);
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-(--loom-black) text-(--loom-white) pb-24 px-4 pt-6">
        <h1 className="text-2xl font-bold mb-6">Избранное</h1>
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-(--loom-black) text-(--loom-white) flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-(--loom-white)/5 rounded-2xl p-8 glitch-border text-center space-y-4">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold text-(--loom-white)">Избранное доступно только авторизованным</h2>
          <p className="text-(--loom-white)/60 text-sm">
            Войдите или зарегистрируйтесь, чтобы сохранять квизы и возвращаться к ним позже.
          </p>
          <div className="flex flex-col gap-3 pt-4">
            <a href="/login" className="w-full py-3 px-4 bg-(--loom-yellow) text-(--loom-black) font-semibold rounded-xl hover:opacity-90 transition text-center">
              Войти
            </a>
            <a href="/register" className="w-full py-3 px-4 bg-(--loom-white)/10 text-(--loom-white) rounded-xl hover:bg-(--loom-white)/20 transition text-center border border-(--loom-white)/20">
              Зарегистрироваться
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-(--loom-black) text-(--loom-white) pb-24 px-4 pt-6">
        <h1 className="text-2xl font-bold mb-6">Избранное</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!localFavorites || localFavorites.length === 0) {
    return (
      <div className="min-h-screen bg-(--loom-black) text-(--loom-white) pb-24 px-4 pt-6">
        <h1 className="text-2xl font-bold mb-6">Избранное</h1>
        <EmptyState
          title="Нет избранных квизов"
          description="Добавляйте квизы в избранное, чтобы быстро возвращаться к ним позже."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--loom-black) text-(--loom-white) pb-24 px-4 pt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Избранное</h1>
        <span className="text-sm text-(--loom-white)/60">
          {localFavorites.length} {pluralize(localFavorites.length, 'квиз', 'квиза', 'квизов')}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {localFavorites.map((fav: any) => {
          const quiz = fav.quiz;
          const lastAttempt = attemptStatuses[quiz.id];
          const isRemoving = removingIds.has(quiz.id);

          if (isRemoving) {
            return <Skeleton key={quiz.id} className="h-32 w-full rounded-xl animate-pulse" />;
          }

          return (
            <Card
              key={quiz.id}
              className="cursor-pointer hover:scale-[1.01] transition-transform duration-200"
              onClick={() => router.push(`/quiz/${quiz.id}/preview`)}
            >
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-xl">{quiz.title}</CardTitle>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={(e) => handleRemove(quiz.id, e)}
                >
                  <div className="pointer-events-none">
                    <StarButton quizId={quiz.id} size={22} />
                  </div>
                  <span className="text-sm text-(--loom-magenta) hover:cursor-pointer">
                    Убрать
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex flex-col gap-1 relative">
                <div className="flex justify-between items-center text-sm text-(--loom-white)/60">
                  <span>
                    {quiz.questions?.length || 0} {pluralize(quiz.questions?.length || 0, 'вопрос', 'вопроса', 'вопросов')}
                  </span>
                  <div className="flex flex-col items-end relative">
                    <div className="absolute -top-14 right-0">
                      {quiz.category?.iconUrl ? (
                        <img
                          src={quiz.category.iconUrl}
                          alt={quiz.category.name}
                          className="w-11 h-11 rounded-full object-contain"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-(--loom-cyan)/20 flex items-center justify-center text-sm text-(--loom-cyan) font-bold">
                          {quiz.category?.name?.[0] || '?'}
                        </div>
                      )}
                    </div>
                    <span className="text-(--loom-cyan) text-lg font-medium">
                      {quiz.category?.name || 'Без категории'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {lastAttempt && (
                    <>
                      <span
                        className={cn(
                          'font-semibold',
                          lastAttempt.score === lastAttempt.totalQuestions && 'text-(--loom-cyan)',
                          lastAttempt.score < lastAttempt.totalQuestions && 'text-(--loom-yellow)'
                        )}
                      >
                        {lastAttempt.score}/{lastAttempt.totalQuestions}
                      </span>
                      <span className="text-(--loom-white)/30">•</span>
                    </>
                  )}
                  <span className="text-(--loom-white)/40">
                    {quiz.level ? quiz.level.charAt(0) + quiz.level.slice(1).toLowerCase() : 'Любой'}
                  </span>
                  {quiz.level && (
                    <span
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        quiz.level === 'JUNIOR' && 'bg-(--loom-cyan)',
                        quiz.level === 'MIDDLE' && 'bg-(--loom-yellow)',
                        quiz.level === 'SENIOR' && 'bg-(--glitch-pink)'
                      )}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}