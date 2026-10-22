'use client';

import { useTheme } from '@/hooks/useTheme';
import { Bell, Sun, Moon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/core/Button';
import { useState } from 'react';
import { Modal } from '@/components/ui/feedback/Modal';
import { useToast } from '@/components/ui/feedback/ToastContainer';
import { useRouter } from 'next/navigation';
import { usePageHeader } from '@/hooks/usePageHeader';
import { PageContentTitle } from '@/components/ui/core/PageContentTitle';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [showResetModal, setShowResetModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: showError } = useToast();
  const router = useRouter();

  const handleResetProgress = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/profile/progress', { method: 'DELETE' });
      if (!res.ok) throw new Error('Ошибка сброса прогресса');
      success('Прогресс успешно сброшен');
      router.refresh();
    } catch (err: any) {
      showError(err.message || 'Не удалось сбросить прогресс');
    } finally {
      setIsLoading(false);
      setShowResetModal(false);
    }
  };

  usePageHeader({ variant: 'tab', title: 'Настройки', showBack: true });

  // Пока сервер рендерит страницу или идет гидратация, показываем дефолтное состояние (заглушку)
  const isDark = theme === 'dark';

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 pb-24">
      
      <PageContentTitle 
        title="Настройки" 
        showBack={true} 
        fallback="/profile" 
      />

      {/* Тема */}
      <div className="glitch-border relative overflow-hidden rounded-2xl bg-(--loom-white)/5 p-5">
        <div className="pointer-events-none absolute inset-0">
          <div className="glitch-scanline-gradient animate-scanline absolute right-0 left-0 mx-auto h-0.75 w-full opacity-50 blur-[1px]" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? (
              <Moon size={20} className="text-(--loom-cyan)" />
            ) : (
              <Sun size={20} className="text-(--loom-yellow)" />
            )}
            <div>
              <span className="font-medium text-(--loom-white)">Тема</span>
              <p className="text-sm text-(--loom-white)/60">{isDark ? 'Тёмная' : 'Светлая'}</p>
            </div>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={toggleTheme}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-(--loom-white)/10 transition-colors duration-200 peer-checked:bg-(--loom-cyan) after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-(--loom-white) after:transition-all after:duration-200 after:content-[''] peer-checked:after:translate-x-5" />
          </label>
        </div>
      </div>

      {/* Сброс прогресса */}
      <div className="glitch-border relative overflow-hidden rounded-2xl bg-(--loom-white)/5 p-5">
        <div className="pointer-events-none absolute inset-0">
          <div className="glitch-scanline-gradient animate-scanline absolute right-0 left-0 mx-auto h-0.75 w-full opacity-50 blur-[1px]" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trash2 size={20} className="text-red-400" />
            <div>
              <span className="font-medium text-(--loom-white)">Сбросить прогресс</span>
              <p className="text-sm text-red-400/60">Все попытки будут удалены безвозвратно</p>
            </div>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowResetModal(true)}
            disabled={isLoading}
          >
            {isLoading ? 'Сброс...' : 'Сбросить'}
          </Button>
        </div>
      </div>

      {/* Уведомления (заглушка) */}
      <div className="glitch-border relative overflow-hidden rounded-2xl bg-(--loom-white)/5 p-5">
        <div className="pointer-events-none absolute inset-0">
          <div className="glitch-scanline-gradient animate-scanline absolute right-0 left-0 mx-auto h-0.75 w-full opacity-50 blur-[1px]" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-(--loom-white)/60" />
            <div>
              <span className="font-medium text-(--loom-white)">Push-уведомления</span>
              <p className="text-sm text-(--loom-white)/40">Скоро появится</p>
            </div>
          </div>

          <div className="relative h-6 w-11 cursor-not-allowed rounded-full bg-(--loom-white)/10 opacity-50">
            <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-(--loom-white)/30" />
          </div>
        </div>
      </div>

      {/* Модалка подтверждения */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onCancel={() => setShowResetModal(false)}
        onConfirm={handleResetProgress}
        title="Сбросить прогресс?"
        confirmText="Сбросить"
        cancelText="Отмена"
      >
        <p>Все ваши попытки и статистика будут удалены безвозвратно. Вы уверены?</p>
      </Modal>
    </div>
  );
}
