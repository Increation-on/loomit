'use client';

import { useTheme } from '@/hooks/useTheme';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { ArrowLeft, Bell, Sun, Moon, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 pb-24">
      {/* Хедер страницы */}
      <div className="flex items-center gap-3">
        <Link href="/profile" className="p-2 rounded-full hover:bg-loom-dark-secondary transition">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-loom-white">Настройки</h1>
      </div>

      {/* Тема */}
      <div className="bg-loom-dark-secondary rounded-lg p-4">
        <h2 className="text-lg font-semibold text-loom-white mb-3">Тема</h2>
        <div className="flex items-center justify-between pt-2 rounded-lg bg-loom-black/50">
          {/* Иконка слева (меняется) */}
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Moon size={20} className="text-loom-cyan" />
            ) : (
              <Sun size={20} className="text-loom-yellow" />
            )}
            <span className="text-sm text-loom-white/60">
              {theme === 'dark' ? 'Тёмная' : 'Светлая'}
            </span>
          </div>

          {/* Toggle Switch справа */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={toggleTheme}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-loom-purple"></div>
          </label>
        </div>
      </div>

      {/* Уведомления (заглушка) */}
      <div className="bg-loom-dark-secondary rounded-lg p-4">
        <h2 className="text-lg font-semibold text-loom-white mb-3">Уведомления</h2>
        <div className="flex items-center justify-between pt-2 rounded-lg bg-loom-black/50">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-loom-white/60" />
            <span className="text-loom-white">Push-уведомления</span>
          </div>
          <div className="w-12 h-6 bg-gray-600 rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition"></div>
          </div>
        </div>
        <p className="text-xs text-loom-white/40 mt-2">Скоро появится возможность включать уведомления</p>
      </div>

      {/* Выход */}
      <div className="pt-4 border-t border-loom-white/10">
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