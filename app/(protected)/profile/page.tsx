'use client';

import { useGetStatsQuery, useGetAttemptsQuery } from '@/store/api/profileApi';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Settings, Star, Shield, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'пользователь';
  const userEmail = session?.user?.email || '';
  const isAdmin = session?.user?.role === 'admin';
  const date = new Date().toLocaleDateString('ru-RU');

  const { data: stats } = useGetStatsQuery({}, { refetchOnMountOrArgChange: true });
  const { data: attemptsData } = useGetAttemptsQuery({}, { refetchOnMountOrArgChange: true });
  const attempts = attemptsData?.attempts;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 pb-24">
      {/* Заголовок и приветствие */}
      <div>
        <h1 className="text-2xl font-bold text-loom-white">Профиль</h1>
        <p className="text-loom-white/80 mt-1">
          Привет, {userName}! Сегодня {date}.
        </p>
      </div>

      {/* Статистика */}
      {stats && (
        <div className="grid grid-cols-2 gap-4">
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

      {/* Ссылка на Избранное */}
      <div>
        <Link 
          href="/favorites" 
          className="flex items-center justify-between p-4 bg-loom-dark-secondary rounded-lg hover:bg-loom-dark-secondary/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Star className="text-loom-yellow" size={20} />
            <span className="text-loom-white font-medium">Избранное</span>
          </div>
          <span className="text-loom-white/60 text-sm">→</span>
        </Link>
      </div>

      {/* Последние попытки */}
      <div>
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

      {/* Настройки, Админка, Выход */}
      <div className="pt-4 border-t border-loom-white/10 space-y-2">
        {/* Настройки */}
        <Link 
          href="profile/settings" 
          className="flex items-center justify-between p-4 bg-loom-dark-secondary rounded-lg hover:bg-loom-dark-secondary/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Settings className="text-loom-white/60" size={20} />
            <span className="text-loom-white font-medium">Настройки</span>
          </div>
          <span className="text-loom-white/60 text-sm">→</span>
        </Link>

        {/* Админ панель (только для админов) */}
        {isAdmin && (
          <Link 
            href="/admin" 
            className="flex items-center justify-between p-4 bg-loom-dark-secondary rounded-lg hover:bg-loom-dark-secondary/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield className="text-loom-purple" size={20} />
              <span className="text-loom-white font-medium">Админ панель</span>
            </div>
            <span className="text-loom-white/60 text-sm">→</span>
          </Link>
        )}

        {/* Выход */}
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center justify-between p-4 bg-loom-dark-secondary rounded-lg hover:bg-red-900/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <LogOut className="text-red-400" size={20} />
            <span className="text-red-400 font-medium">Выход</span>
          </div>
          <span className="text-red-400/60 text-sm">→</span>
        </button>
      </div>
    </div>
  );
}