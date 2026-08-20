'use client';

import { useGetStatsQuery, useGetAttemptsQuery } from '@/store/api/profileApi';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Settings, Shield, LogOut } from 'lucide-react';
import { Skeleton } from '@/components/ui/feedback/Skeleton';

export default function ProfilePage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'пользователь';
  const isAdmin = session?.user?.role === 'admin';
  const date = new Date().toLocaleDateString('ru-RU');

  const { data: stats, isLoading: statsLoading } = useGetStatsQuery({}, { refetchOnMountOrArgChange: true });
  const { data: attemptsData, isLoading: attemptsLoading } = useGetAttemptsQuery({}, { refetchOnMountOrArgChange: true });
  const attempts = attemptsData?.attempts;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 pb-24">

      {/* 1. Приветствие */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-(--loom-white)">Профиль</h1>
          <div className="w-12 h-12 rounded-full bg-(--loom-magenta) flex items-center justify-center font-bold text-lg text-(--loom-white)">
            {userName[0]}
          </div>
        </div>
        <p className="text-(--loom-white)/60 mt-2">
          Привет, <span className='text-(--loom-yellow)'>{userName}</span>! Сегодня {date}
        </p>
      </div>

      {/* 2. Статистика */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-2 bg-(--loom-white)/5 rounded-xl glitch-border flex flex-col items-center justify-between text-center h-25">
          <p className="text-(--loom-white)/60 text-sm">Всего попыток</p>
          {statsLoading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-3xl font-bold text-(--loom-white) mt-1">{stats?.totalAttempts || 0}</p>
          )}
        </div>
        <div className="p-2 bg-(--loom-white)/5 rounded-xl glitch-border flex flex-col items-center justify-between text-center">
          <p className="text-(--loom-white)/60 text-sm">Средний результат</p>
          {statsLoading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-3xl font-bold text-(--loom-white) mt-1">{stats?.averageScore || 0}%</p>
          )}
        </div>
      </div>

      {/* 3. Последние попытки */}
      <div>
        <div className="flex justify-between items-center mb-4">
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
                  className="p-4 bg-(--loom-white)/5 rounded-xl glitch-border flex justify-between items-center transition-colors"
                >
                  <div>
                    <p className="text-(--loom-magenta) font-semibold">{a.quizTitle}</p>
                    <p className="text-(--loom-white)/60 text-sm">
                      {a.score}/{a.totalQuestions} · {new Date(a.createdAt).toLocaleDateString('ru')}
                    </p>
                    <p className="text-xs text-(--loom-white)/40">
                      {a.syncStatus === 'synced' ? 'Сохранено' : a.syncStatus === 'pending' ? 'Ожидает' : 'Не удалось'}
                    </p>
                  </div>
                  <Link
                    href={`/profile/attempts/${a.id}`}
                    className="text-(--loom-cyan) text-sm hover:text-(--loom-yellow) transition-colors active:scale-[0.98]"
                  >
                    Подробнее
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Link
                href="/profile/history"
                className="text-(--loom-yellow) text-sm hover:text-(--loom-yellow) active:scale-[0.98] transition-all duration-100"
              >
                Вся история
              </Link>
            </div>
          </>
        )}
      </div>

      {/* 4. Настройки / Админка / Выход */}
      <div className="pt-4 border-t border-(--loom-white)/10 space-y-2">

        <div
          onClick={() => window.location.href = '/profile/settings'}
          className="flex items-center gap-3 p-4 bg-(--loom-white)/5 rounded-xl glitch-border cursor-pointer active:scale-[0.98] active:bg-(--loom-white)/10 transition-all duration-100"
        >
          <Settings className="text-(--loom-white)/60" size={20} />
          <span className="text-(--loom-white) font-medium">Настройки</span>
        </div>

        {isAdmin && (
          <div
            onClick={() => window.location.href = '/admin'}
            className="flex items-center gap-3 p-4 bg-(--loom-white)/5 rounded-xl glitch-border cursor-pointer active:scale-[0.98] active:bg-(--loom-white)/10 transition-all duration-100"
          >
            <Shield className="text-(--loom-magenta)" size={20} />
            <span className="text-(--loom-white) font-medium">Админ панель</span>
          </div>
        )}

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 p-4 bg-(--loom-white)/5 rounded-xl glitch-border cursor-pointer active:scale-[0.98] active:bg-red-900/10 transition-all duration-100"
        >
          <LogOut className="text-red-400" size={20} />
          <span className="text-red-400 font-medium">Выход</span>
        </button>
      </div>
    </div>
  );
}
