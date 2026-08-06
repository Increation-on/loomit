'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisible(true);
      });
    });
  }, [pathname]);

  return (
    <div
      className={`
        transition-all
        duration-200
        ease-out
        will-change-transform
        ${
          visible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-2'
        }
      `}
    >
      {children}
    </div>
  );
}