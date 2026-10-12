'use client';

import { useEffect, useRef, useState } from 'react';
import { formatCode } from '@/lib/utils/quiz';

const CHAR_WIDTH_RATIO = 0.6; // средняя ширина моноширинного символа к fontSize

export function useFormattedCode(code: string) {
  const [formatted, setFormatted] = useState(code);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    let cancelled = false;

    const format = async () => {
      // Измеряем ширину контейнера и fontSize
      const width = node.clientWidth;
      const fontSize = parseFloat(getComputedStyle(node).fontSize) || 14;

      // Отнимаем padding (24px — твой p-3 с двух сторон)
      const padding = 24;
      const availableWidth = width - padding;

      // Пиксели → символы
      const printWidth = Math.max(
        40,
        Math.floor(availableWidth / (fontSize * CHAR_WIDTH_RATIO))
      );

      const result = await formatCode(code, printWidth);
      if (!cancelled) setFormatted(result);
    };

    format();

    return () => {
      cancelled = true;
    };
  }, [code]);

  return { formatted, ref: containerRef };
}