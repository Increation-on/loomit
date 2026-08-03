'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
  // Небольшая задержка, чтобы анимация успела завершиться
  const timeout = setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, 200);

  return () => clearTimeout(timeout);
}, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.1 }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}