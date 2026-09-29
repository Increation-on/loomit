'use client';

import { useQuizFontSize } from '@/hooks/useQuizFontSize';

interface QuizTitleProps {
  title: string;
}

export function QuizTitle({ title }: QuizTitleProps) {
  const { fontSize, ref } = useQuizFontSize({
    text: title,
    minFontSize: 14,
    maxFontSize: 22,
    step: 0.5,
    mode: 'dom',
    dependencies: [title],
  });

  return (
    <div className="h-12 flex items-center justify-center">
      <h1
        ref={ref}
        className="font-bold text-(--loom-cyan) text-center w-full"
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.2 }}
      >
        {title}
      </h1>
    </div>
  );
}