'use client';

import { useGetStatsQuery, useGetAttemptsQuery } from '@/store/api/profileApi';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Settings, Shield, LogOut } from 'lucide-react';
import { Skeleton } from '@/components/ui/feedback/Skeleton';
import { useNavigationTransition } from '@/components/layout/NavigationProvider';
import { useRouter } from 'next/navigation';
import { usePageHeader } from '@/hooks/usePageHeader';

export default function ProfilePage() {
  const { data: session } = useSession();
  const fullname = session?.user?.name || 'пользователь';
  const userName = fullname.split(' ')[0];
  const isAdmin = session?.user?.role === 'admin';
  const date = new Date().toLocaleDateString('ru-RU');
  const router = useRouter();

  const { data: stats, isLoading: statsLoading } = useGetStatsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: attemptsData, isLoading: attemptsLoading } = useGetAttemptsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const attempts = attemptsData?.attempts;
  const { setAttemptReturnTo } = useNavigationTransition();

  usePageHeader({ variant: 'tab', title: 'Профиль' });

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6 pb-24">
      {/* 1. Приветствие */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-(--loom-white)">Профиль</h1>
        </div>
        <p className="mt-2 text-(--loom-white)/60">
          Привет, <span className="text-(--loom-yellow)">{userName}</span>! Сегодня {date}
        </p>
      </div>

      {/* 2. Статистика */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glitch-border flex h-25 flex-col items-center justify-between rounded-xl bg-(--loom-white)/5 p-2 text-center">
          <p className="text-sm text-(--loom-white)/60">Всего попыток</p>
          {statsLoading ? (
            <Skeleton className="mt-1 h-8 w-16" />
          ) : (
            <p className="mt-1 text-3xl font-bold text-(--loom-white)">
              {stats?.totalAttempts || 0}
            </p>
          )}
        </div>
        <div className="glitch-border flex flex-col items-center justify-between rounded-xl bg-(--loom-white)/5 p-2 text-center">
          <p className="text-sm text-(--loom-white)/60">Средний результат</p>
          {statsLoading ? (
            <Skeleton className="mt-1 h-8 w-16" />
          ) : (
            <p className="mt-1 text-3xl font-bold text-(--loom-white)">
              {stats?.averageScore || 0}%
            </p>
          )}
        </div>
      </div>

      {/* 3. Последние попытки */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-(--loom-white)">Последние попытки</h2>
        </div>
        {attemptsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : attempts && attempts.length === 0 ? (
          <p className="text-(--loom-white)/60">Вы ещё не прошли ни одного квиза.</p>
        ) : (
          <>
            <div className="space-y-3">
              {attempts?.map((a: any) => (
                <div
                  key={a.id}
                  className="glitch-border flex items-center justify-between rounded-xl bg-(--loom-white)/5 p-4 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-(--loom-magenta)">{a.quizTitle}</p>
                    <p className="text-sm text-(--loom-white)/60">
                      {a.score}/{a.totalQuestions} ·{' '}
                      {new Date(a.createdAt).toLocaleDateString('ru')}
                    </p>
                    <p className="text-xs text-(--loom-white)/40">
                      {a.syncStatus === 'synced'
                        ? 'Сохранено'
                        : a.syncStatus === 'pending'
                          ? 'Ожидает'
                          : 'Не удалось'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAttemptReturnTo('/profile');
                      router.push(`/profile/attempts/${a.id}`);
                    }}
                    className="text-sm text-(--loom-cyan) transition-all duration-100 hover:text-(--loom-yellow) active:scale-[0.98]"
                  >
                    Подробнее
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Link
                href="/profile/history"
                className="text-sm text-(--loom-yellow) transition-all duration-100 hover:text-(--loom-yellow) active:scale-[0.98]"
              >
                Вся история
              </Link>
            </div>
          </>
        )}
      </div>

      {/* 4. Настройки / Админка / Выход */}
      <div className="space-y-2 border-t border-(--loom-white)/10 pt-4">
        <div
          onClick={() => (window.location.href = '/profile/settings')}
          className="glitch-border flex cursor-pointer items-center gap-3 rounded-xl bg-(--loom-white)/5 p-4 transition-all duration-100 active:scale-[0.98] active:bg-(--loom-white)/10"
        >
          <Settings className="text-(--loom-white)/60" size={20} />
          <span className="font-medium text-(--loom-white)">Настройки</span>
        </div>

        {isAdmin && (
          <div
            onClick={() => (window.location.href = '/admin')}
            className="glitch-border flex cursor-pointer items-center gap-3 rounded-xl bg-(--loom-white)/5 p-4 transition-all duration-100 active:scale-[0.98] active:bg-(--loom-white)/10"
          >
            <Shield className="text-(--loom-magenta)" size={20} />
            <span className="font-medium text-(--loom-white)">Админ панель</span>
          </div>
        )}

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="glitch-border flex w-full cursor-pointer items-center gap-3 rounded-xl bg-(--loom-white)/5 p-4 transition-all duration-100 active:scale-[0.98] active:bg-red-900/10"
        >
          <LogOut className="text-red-400" size={20} />
          <span className="font-medium text-red-400">Выход</span>
        </button>
      </div>
    </div>
  );
}
