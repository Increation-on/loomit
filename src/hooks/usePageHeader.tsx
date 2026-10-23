// src/hooks/usePageHeader.ts
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '@/store/store';
import { setHeader, HeaderVariant } from '@/store/slices/headerSlice';

interface PageHeaderConfig {
  variant: HeaderVariant;
  title?: string;
  showBack?: boolean;
  fallback?: string;
}

export const usePageHeader = ({ variant, title, showBack, fallback }: PageHeaderConfig) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(
      setHeader({
        path: pathname,
        variant,
        title,
        showBack,
        fallback,
      })
    );
  }, [dispatch, pathname, variant, title, showBack, fallback]);
};
