'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePWA } from '@/hooks/usePWA';

interface AnimatedNavigationProps {
  children: React.ReactNode;
  direction?: 'up' | 'down';
}

export function AnimatedNavigation({ 
  children, 
  direction = 'up' 
}: AnimatedNavigationProps) {
  const hideNavigation = usePWA();

  const yOffset = direction === 'up' ? -20 : 20;

  return (
    <AnimatePresence mode="wait">
      {!hideNavigation && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: yOffset }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}