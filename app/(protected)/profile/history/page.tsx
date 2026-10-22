// app/profile/history/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetAllAttemptsQuery } from '@/store/api/profileApi';
import { Skeleton } from '@/components/ui/feedback/Skeleton';
import { useNavigationTransition } from '@/components/layout/NavigationProvider';
import { usePageHeader } from '@/hooks/usePageHeader';
import { PageContentTitle } from '@/components/ui/core/PageContentTitle';

export default function HistoryPage() {
  const router = useRouter();
  const { setAttemptReturnTo } = useNavigationTransition();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAllAttemptsQuery(page);
  
  usePageHeader({ variant: 'nested', title: 'Вся история', showBack: true });

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 pb-24">
      
      <PageContentTitle 
        title="Вся история" 
        showBack={true} 
        fallback="/profile" 
      />

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : data?.attempts?.length === 0 ? (
        <p className="py-10 text-center text-(--loom-white)/60">
          Вы пока не прошли ни одного квиза.
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {data?.attempts?.map((a: any) => (
              <div
                key={a.id}
                className="glitch-border flex items-center justify-between rounded-xl bg-(--loom-white)/5 p-4 transition-colors"
              >
                <div>
                  <p className="font-semibold text-(--loom-magenta)">{a.quizTitle}</p>
                  <p className="text-sm text-(--loom-white)/60">
                    {a.score}/{a.totalQuestions} · {new Date(a.createdAt).toLocaleDateString('ru')}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setAttemptReturnTo('/profile/history');
                    router.push(`/profile/attempts/${a.id}`);
                  }}
                  className="text-sm text-(--loom-cyan) transition-all duration-100 hover:text-(--loom-yellow) active:scale-[0.98]"
                >
                  Подробнее
                </button>
              </div>
            ))}
          </div>

          {data?.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="glitch-border rounded-xl bg-(--loom-white)/5 px-4 py-2 text-(--loom-white)/60 transition-all duration-100 hover:text-(--loom-white) active:scale-[0.98] disabled:opacity-30 disabled:active:scale-100"
              >
                Назад
              </button>
              <span className="px-4 py-2 text-sm text-(--loom-white)/60">
                {page} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === data.totalPages}
                className="glitch-border rounded-xl bg-(--loom-white)/5 px-4 py-2 text-(--loom-white)/60 transition-all duration-100 hover:text-(--loom-white) active:scale-[0.98] disabled:opacity-30 disabled:active:scale-100"
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
