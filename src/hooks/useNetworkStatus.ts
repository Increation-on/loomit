'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/store';
import { processSyncQueue } from '@/store/slices/syncSlice';
import { useToast } from '@/components/ui/feedback/ToastContainer';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  );
  const dispatch = useAppDispatch();
  const { info, warning } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      dispatch(processSyncQueue());
      info('Подключение восстановлено');
    };

    const handleOffline = () => {
      setIsOnline(false);
      warning('Интернет пропал');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch, info, warning]);

  return isOnline;
}