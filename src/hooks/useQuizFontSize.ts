'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface UseQuizFontSizeProps {
  text: string;
  minFontSize?: number;
  maxFontSize?: number;
  step?: number;
  mode?: 'canvas' | 'dom';
  dependencies?: any[];
}

export const useQuizFontSize = ({
  text,
  minFontSize = 12,
  maxFontSize = 24,
  step = 1,
  mode = 'canvas',
  dependencies = [],
}: UseQuizFontSizeProps) => {
  const [fontSize, setFontSize] = useState<number>(maxFontSize);
  const [isReady, setIsReady] = useState<boolean>(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const lastSizeRef = useRef<number | null>(null);

  const adjustFontSize = useCallback(
    (node: HTMLElement) => {
      if (!node || !text) return;

      setIsReady(false);

      const computedStyle = window.getComputedStyle(node);
      const paddingX =
        parseFloat(computedStyle.paddingLeft) +
        parseFloat(computedStyle.paddingRight);
      const paddingY =
        parseFloat(computedStyle.paddingTop) +
        parseFloat(computedStyle.paddingBottom);

      let availableWidth = node.clientWidth - paddingX;
      let availableHeight = node.clientHeight - paddingY;

      if (mode === 'dom' && node.parentElement) {
        const parentStyle = window.getComputedStyle(node.parentElement);
        const parentPaddingX =
          parseFloat(parentStyle.paddingLeft) + parseFloat(parentStyle.paddingRight);
        const parentPaddingY =
          parseFloat(parentStyle.paddingTop) + parseFloat(parentStyle.paddingBottom);

        availableWidth = node.parentElement.clientWidth - parentPaddingX;
        availableHeight = node.parentElement.clientHeight - parentPaddingY;
      }

      if (availableWidth <= 0 || availableHeight <= 0) return;

      let currentSize = maxFontSize;

      if (mode === 'dom') {
        const clone = node.cloneNode(true) as HTMLElement;
        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.width = `${availableWidth}px`;
        clone.style.height = 'auto';
        clone.style.maxHeight = 'none';
        document.body.appendChild(clone);

        // Находим этот блок внутри режима 'dom' в useQuizFontSize.tsx и заменяем:
        while (currentSize > minFontSize) {
          clone.style.fontSize = `${currentSize}px`;

          // 🔑 КРИТИЧЕСКИЙ ФИКС: Проверяем, что контент не вылезает по ширине И по высоте
          const isWidthFits = clone.scrollWidth <= availableWidth;
          const isHeightFits = clone.offsetHeight <= availableHeight;

          if (isWidthFits && isHeightFits) {
            break;
          }
          currentSize -= step;
        }

        document.body.removeChild(clone);
      } else {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;

        const fontFamily = computedStyle.fontFamily || 'sans-serif';
        const fontWeight = computedStyle.fontWeight || 'normal';

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
      }
      // 🔑 Защита от повторов — не обновляем, если размер не изменился
      if (lastSizeRef.current === currentSize) {
        setIsReady(true);
        return;
      }
      lastSizeRef.current = currentSize;
      setFontSize(currentSize);

      requestAnimationFrame(() => {
        setIsReady(true);
      });
    },
    [text, minFontSize, maxFontSize, step, mode]
  );

  const refCallback = useCallback(
    (node: HTMLElement | null) => {
      if (node) {
        elementRef.current = node;
        adjustFontSize(node);
      } else if (elementRef.current) {
        elementRef.current = null;
      }
    },
    [adjustFontSize]
  );

  // Сброс кэша при смене текста
  useEffect(() => {
    lastSizeRef.current = null;
  }, [text]);

  useEffect(() => {
    if (elementRef.current) {
      adjustFontSize(elementRef.current);
    }
  }, [text, adjustFontSize, ...dependencies]);

  return { fontSize, isReady, ref: refCallback };
};