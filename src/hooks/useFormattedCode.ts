'use client';

import { useEffect, useRef, useState } from 'react';
import { formatCode } from '@/lib/utils/quiz';

const CHAR_WIDTH_RATIO = 0.6;
const CONTAINER_PADDING = 24;
const RESIZE_THRESHOLD = 8;

export function useFormattedCode(code: string, lang?: string | null) {
  const [formatted, setFormatted] = useState(code);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastWidthRef = useRef<number>(0);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    let cancelled = false;

    const run = async (width: number) => {
      if (width <= 0) return;

      const fontSize = parseFloat(getComputedStyle(node).fontSize) || 14;
      const availableWidth = width - CONTAINER_PADDING;
      const printWidth = Math.max(40, Math.floor(availableWidth / (fontSize * CHAR_WIDTH_RATIO)));

      const result = await formatCode(code, lang, printWidth);
      if (!cancelled) setFormatted(result);
    };

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;

      if (Math.abs(width - lastWidthRef.current) < RESIZE_THRESHOLD) return;
      lastWidthRef.current = width;

      run(width);
    });

    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [code, lang]);

  return { formatted, ref: containerRef };
}
