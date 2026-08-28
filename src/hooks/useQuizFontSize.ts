'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface UseQuizFontSizeProps {
  text: string;
  minFontSize?: number;
  maxFontSize?: number;
  step?: number;
  dependencies?: any[]; // Новое: зависимости для сброса стейта
}

export const useQuizFontSize = ({
  text,
  minFontSize = 12,
  maxFontSize = 24,
  step = 1,
  dependencies = [], // По умолчанию пустой массив
}: UseQuizFontSizeProps) => {
  const [fontSize, setFontSize] = useState<number>(maxFontSize);
  const [isReady, setIsReady] = useState<boolean>(false); // Новое: убирает прыжки
  const elementRef = useRef<HTMLElement | null>(null);

  const adjustFontSize = useCallback(
    (node: HTMLElement) => {
      if (!node || !text) return;

      const computedStyle = window.getComputedStyle(node);
      const paddingX =
        parseFloat(computedStyle.paddingLeft) +
        parseFloat(computedStyle.paddingRight);
      const paddingY =
        parseFloat(computedStyle.paddingTop) +
        parseFloat(computedStyle.paddingBottom);

      const availableWidth = node.clientWidth - paddingX;
      const availableHeight = node.clientHeight - paddingY;

      if (availableWidth <= 0 || availableHeight <= 0) return;

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;

      const fontFamily = computedStyle.fontFamily || 'sans-serif';
      const fontWeight = computedStyle.fontWeight || 'normal';

      let currentSize = maxFontSize;

      while (currentSize > minFontSize) {
        context.font = `${fontWeight} ${currentSize}px ${fontFamily}`;
        const metrics = context.measureText(text);
        const textWidth = metrics.width;
        const textHeight = currentSize * 1.2;

        if (textWidth <= availableWidth && textHeight <= availableHeight) {
          break;
        }
        currentSize -= step;
      }

      setFontSize(currentSize);
      
      // Показываем текст только после того, как размер точно подогнан
      requestAnimationFrame(() => {
        setIsReady(true);
      });
    },
    [text, minFontSize, maxFontSize, step]
  );

  const refCallback = useCallback(
    (node: HTMLElement | null) => {
      if (node) {
        elementRef.current = node;
        adjustFontSize(node);

        const resizeObserver = new ResizeObserver(() => {
          adjustFontSize(node);
        });
        resizeObserver.observe(node);

        (node as any)._ro = resizeObserver;
      } else if (elementRef.current) {
        const oldNode = elementRef.current as any;
        if (oldNode._ro) {
          oldNode._ro.disconnect();
        }
        elementRef.current = null;
      }
    },
    [adjustFontSize]
  );

  // Следим за текстом и внешними изменениями (клик, появление иконки)
  useEffect(() => {
    if (elementRef.current) {
      setIsReady(false); // Скрываем текст на мгновение перед перерасчетом
      adjustFontSize(elementRef.current);
    }
  }, [text, adjustFontSize, ...dependencies]);

  return { fontSize, isReady, ref: refCallback };
};
