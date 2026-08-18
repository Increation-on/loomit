// app/profile/history/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetAllAttemptsQuery } from '@/store/api/profileApi';
import { Skeleton } from '@/components/ui/feedback/Skeleton';
import { useNavigationTransition } from '@/components/layout/NavigationProvider';
import { BackLink } from '@/components/layout/BackLink';

export default function HistoryPage() {
  const router = useRouter();
  const { setAttemptReturnTo } = useNavigationTransition();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAllAttemptsQuery(page);

  return (
    <div className="p-6 max-w-2xl mx-auto pb-24 space-y-6">
      <BackLink fallback="/profile" />

      <h1 className="text-2xl font-bold text-(--loom-white) mb-6">Вся история</h1>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : data?.attempts?.length === 0 ? (
        <p className="text-(--loom-white)/60 text-center py-10">
          Вы пока не прошли ни одного квиза.
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {data?.attempts?.map((a: any) => (
              <div
                key={a.id}
                className="p-4 bg-(--loom-white)/5 rounded-xl glitch-border flex justify-between items-center transition-colors"
              >
                <div>
                  <p className="text-(--loom-magenta) font-semibold">{a.quizTitle}</p>
                  <p className="text-(--loom-white)/60 text-sm">
                    {a.score}/{a.totalQuestions} · {new Date(a.createdAt).toLocaleDateString('ru')}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setAttemptReturnTo('/profile/history');
                    router.push(`/profile/attempts/${a.id}`);
                  }}
                  className="text-(--loom-cyan) text-sm hover:text-(--loom-yellow) active:scale-[0.98] transition-all duration-100"
                >
                  Подробнее
                </button>
              </div>
            ))}
          </div>

          {data?.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-(--loom-white)/5 rounded-xl glitch-border text-(--loom-white)/60 hover:text-(--loom-white) active:scale-[0.98] transition-all duration-100 disabled:opacity-30 disabled:active:scale-100"
              >
                Назад
              </button>
              <span className="px-4 py-2 text-(--loom-white)/60 text-sm">
                {page} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === data.totalPages}
                className="px-4 py-2 bg-(--loom-white)/5 rounded-xl glitch-border text-(--loom-white)/60 hover:text-(--loom-white) active:scale-[0.98] transition-all duration-100 disabled:opacity-30 disabled:active:scale-100"
              >
                Вперёд
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}