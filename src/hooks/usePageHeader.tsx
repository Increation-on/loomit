// src/hooks/usePageHeader.ts
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '@/store/store'; // Путь может отличаться, проверь свой
import { setHeader, HeaderVariant } from '@/store/slices/headerSlice';

interface PageHeaderConfig {
  variant: HeaderVariant;
  title?: string;
  showBack?: boolean;
}

export const usePageHeader = ({ variant, title, showBack }: PageHeaderConfig) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(
      setHeader({
        path: pathname,
        variant,
        title,
        showBack,
      })
    );
  }, [dispatch, pathname, variant, title, showBack]);
};
