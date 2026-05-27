'use client';

import { useGetStatsQuery, useGetAttemptsQuery } from '@/store/api/profileApi';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'пользователь';
  const date = new Date().toLocaleDateString('ru-RU');

  const { data: stats } = useGetStatsQuery({}, { refetchOnMountOrArgChange: true });
  const { data: attemptsData } = useGetAttemptsQuery({}, { refetchOnMountOrArgChange: true });
  const attempts = attemptsData?.attempts;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-loom-white mb-4">Профиль</h1>
      <p className="text-loom-white/80 mb-6">
        Привет, {userName}! Сегодня {date}.
      </p>

      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-loom-dark-secondary rounded-lg">
            <p className="text-loom-white/60 text-sm">Всего пройдено</p>
            <p className="text-2xl font-bold text-loom-white">{stats.totalAttempts}</p>
          </div>
          <div className="p-4 bg-loom-dark-secondary rounded-lg">
            <p className="text-loom-white/60 text-sm">Средний балл</p>
            <p className="text-2xl font-bold text-loom-white">{stats.averageScore}%</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-loom-white">Последние попытки</h2>
        <Link href="/profile/history" className="text-loom-cyan text-sm hover:text-loom-yellow">
          Вся история →
        </Link>
      </div>

      {attempts && attempts.length === 0 && (
        <p className="text-loom-white/60">Вы ещё не прошли ни одного квиза.</p>
      )}

      <div className="space-y-3">
        {attempts?.map((a: any) => (
          <div key={a.id} className="p-4 bg-loom-dark-secondary rounded-lg flex justify-between items-center">
            <div>
              <p className="text-loom-white font-semibold">{a.quizTitle}</p>
              <p className="text-loom-white/60 text-sm">
                {a.score}/{a.totalQuestions} · {new Date(a.createdAt).toLocaleDateString('ru')}
              </p>
              <p className="text-xs text-loom-white/40">
                {a.syncStatus === 'synced' ? 'Сохранено' : a.syncStatus === 'pending' ? 'Ожидает' : 'Не удалось'}
              </p>
            </div>
            <Link href={`/profile/attempts/${a.id}`} className="text-loom-cyan text-sm hover:text-loom-yellow">
              Подробнее
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}