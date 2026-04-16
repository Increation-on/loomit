// src/components/ui/feedback/NetworkIndicator.tsx
'use client';

import { useEffect, useState } from 'react';

export default function NetworkIndicator() {
  const [isOnline, setIsOnline] = useState(true); // Сервер всегда рендерит true
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Пока не смонтировано — показываем заглушку (или ничего)
  if (!mounted) {
    return <div className="w-2 h-2 rounded-full bg-gray-300" />;
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          isOnline ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <span className="text-xs text-gray-600 hidden sm:inline">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
}