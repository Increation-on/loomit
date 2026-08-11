'use client';

import { useEffect, useState } from 'react';

interface UseQuizFontSizeOptions {
  texts: string[];
  containerHeight?: number;
  horizontalPadding?: number;
  minFontSize?: number;
  maxFontSize?: number;
  width?: string;
}

export function useQuizFontSize({
  texts,
  containerHeight = 112,
  horizontalPadding = 24,
  minFontSize = 16,
  maxFontSize = 28,
  width,
}: UseQuizFontSizeOptions) {
  const [fontSize, setFontSize] = useState<number | null>(null);
  const [fontSizes, setFontSizes] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!texts.length) {
      setFontSize(null);
      setFontSizes([]);
      setReady(false);
      return;
    }

    const measureElement = document.createElement('div');

    Object.assign(measureElement.style, {
      position: 'absolute',
      visibility: 'hidden',
      pointerEvents: 'none',
      left: '0',
      top: '0',

      width: width ?? `calc(100vw - ${horizontalPadding * 2}px)`,

      height: `${containerHeight}px`,
      overflow: 'hidden',
      fontWeight: '700',
      lineHeight: '1.2',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      boxSizing: 'border-box',
    });

    document.body.appendChild(measureElement);

    const calculatedFontSizes: number[] = [];

    for (const text of texts) {
      measureElement.textContent = text;

      let currentSize = maxFontSize;

      measureElement.style.fontSize = `${currentSize}px`;

      while (
        measureElement.scrollHeight > containerHeight &&
        currentSize > minFontSize
      ) {
        currentSize -= 1;
        measureElement.style.fontSize = `${currentSize}px`;
      }

      calculatedFontSizes.push(currentSize);
    }

    document.body.removeChild(measureElement);

    const smallestFontSize = Math.min(...calculatedFontSizes);

    setFontSize(smallestFontSize);
    setFontSizes(calculatedFontSizes);
    setReady(true);
  }, [
    texts,
    containerHeight,
    horizontalPadding,
    minFontSize,
    maxFontSize,
    width,
  ]);

  return {
    fontSize,
    fontSizes,
    ready,
  };
}