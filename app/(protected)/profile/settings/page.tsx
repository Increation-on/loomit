'use client';

import { useTheme } from '@/hooks/useTheme';
import Link from 'next/link';
import { ArrowLeft, Bell, Sun, Moon } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 pb-24">
      {/* Хедер страницы */}
      <div className="flex items-center gap-3">
        <Link
          href="/profile"
          className="p-2 rounded-xl bg-(--loom-white)/5 glitch-border hover:bg-(--loom-white)/10 active:scale-[0.98] transition-all duration-100"
        >
          <ArrowLeft size={24} className="text-(--loom-white)" />
        </Link>
        <h1 className="text-2xl font-bold text-(--loom-white)">Настройки</h1>
      </div>

      {/* Тема */}
      <div className="bg-(--loom-white)/5 rounded-2xl p-5 glitch-border relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 right-0 mx-auto w-full h-0.75 glitch-scanline-gradient opacity-50 blur-[1px] animate-scanline" />
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon size={20} className="text-(--loom-cyan)" />
            ) : (
              <Sun size={20} className="text-(--loom-yellow)" />
            )}
            <div>
              <span className="text-(--loom-white) font-medium">Тема</span>
              <p className="text-sm text-(--loom-white)/60">
                {theme === 'dark' ? 'Тёмная' : 'Светлая'}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={toggleTheme}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-(--loom-white)/10 rounded-full peer peer-checked:bg-(--loom-cyan) transition-colors duration-200 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-(--loom-white) after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-200 peer-checked:after:translate-x-5" />
          </label>
        </div>
      </div>

      {/* Уведомления (заглушка) */}
      <div className="bg-(--loom-white)/5 rounded-2xl p-5 glitch-border relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 right-0 mx-auto w-full h-0.75 glitch-scanline-gradient opacity-50 blur-[1px] animate-scanline" />
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-(--loom-white)/60" />
            <div>
              <span className="text-(--loom-white) font-medium">Push-уведомления</span>
              <p className="text-sm text-(--loom-white)/40">Скоро появится</p>
            </div>
          </div>

          <div className="w-11 h-6 bg-(--loom-white)/10 rounded-full opacity-50 cursor-not-allowed relative">
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-(--loom-white)/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}