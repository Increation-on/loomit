// src/components/features/NavigationProvider.tsx

'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { usePathname } from 'next/navigation';

type NavigationContextType = {
  startGlitchTransition: () => void;
  finishGlitchTransition: () => void;
  quizOrigin: string | null;
  setQuizOrigin: (origin: string) => void;
  clearQuizOrigin: () => void;
  attemptReturnTo: string | null;
  setAttemptReturnTo: (route: string) => void;
  clearAttemptReturnTo: () => void;
};

type NoiseLine = {
  id: number;
  top: number;
  left: number;
  width: number;
  color: string;
  delay: number;
  rotate: number;
};

const COLORS = [
  'var(--loom-cyan)',
  'var(--loom-magenta)',
  'var(--loom-yellow)',
];

function generateNoise(): NoiseLine[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i,
    top: 10 + Math.random() * 80,
    left: 5 + Math.random() * 80,
    width:
      Math.random() > 0.85
        ? 20 + Math.random() * 10
        : 4 + Math.random() * 12,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 0.12,
    rotate: Math.random() * 2 - 1,
  }));
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [noise, setNoise] = useState<NoiseLine[]>([]);
  const pathname = usePathname();

  const [quizOrigin, setQuizOrigin] = useState<string | null>(null);
  const [attemptReturnTo, setAttemptReturnTo] = useState<string | null>(null);

  const clearQuizOrigin = () => setQuizOrigin(null);
  const clearAttemptReturnTo = () => setAttemptReturnTo(null);

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  const startGlitchTransition = () => {
    setNoise(generateNoise());
    setLoading(true);
  };

  return (
    <NavigationContext.Provider
      value={{
        startGlitchTransition,
        finishGlitchTransition: () => setLoading(false),
        quizOrigin,
        setQuizOrigin,
        clearQuizOrigin,
        attemptReturnTo,
        setAttemptReturnTo,
        clearAttemptReturnTo,
      }}
    >
      {children}

      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(circle at center, rgba(30,30,45,.85) 0%, rgba(0,0,0,.96) 100%)',
          opacity: loading ? 1 : 0,
          transition: 'opacity 350ms cubic-bezier(.22,1,.36,1)',
          pointerEvents: 'none',
          zIndex: 99999,
          overflow: 'hidden',
        }}
      >
        {loading &&
          noise.map((line) => (
            <div
              key={line.id}
              className="noise-line"
              style={{
                top: `${line.top}%`,
                left: `${line.left}%`,
                width: `${line.width}%`,
                background: line.color,
                boxShadow: `0 0 6px ${line.color}`,
                animationDelay: `${line.delay}s`,
                transform: `rotate(${line.rotate}deg)`,
              }}
            />
          ))}
      </div>
    </NavigationContext.Provider>
  );
}

export function useNavigationTransition() {
  const ctx = useContext(NavigationContext);

  if (!ctx) {
    throw new Error(
      'useNavigationTransition must be used inside NavigationProvider'
    );
  }

  return ctx;
}