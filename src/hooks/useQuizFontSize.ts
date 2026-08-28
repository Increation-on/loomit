'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface UseQuizFontSizeProps {
  text: string;
  minFontSize?: number;
  maxFontSize?: number;
  step?: number;
  mode?: 'canvas' | 'dom'; // Новое: переключатель режима расчета
  dependencies?: any[];    // Зависимости для перезапуска
}

export const useQuizFontSize = ({
  text,
  minFontSize = 12,
  maxFontSize = 24,
  step = 1,
  mode = 'canvas',         // По умолчанию используем быстрый Canvas
  dependencies = [],
}: UseQuizFontSizeProps) => {
  const [fontSize, setFontSize] = useState<number>(maxFontSize);
  const [isReady, setIsReady] = useState<boolean>(false); // Защита от прыжков
  const elementRef = useRef<HTMLElement | null>(null);

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

      // Рассчитываем доступные границы
      let availableWidth = node.clientWidth - paddingX;
      let availableHeight = node.clientHeight - paddingY;

      // Если мы в DOM-режиме, надежнее мерить по родителю (как для вопроса)
      if (mode === 'dom' && node.parentElement) {
        const parentStyle = window.getComputedStyle(node.parentElement);
        const parentPaddingX = parseFloat(parentStyle.paddingLeft) + parseFloat(parentStyle.paddingRight);
        const parentPaddingY = parseFloat(parentStyle.paddingTop) + parseFloat(parentStyle.paddingBottom);
        
        availableWidth = node.parentElement.clientWidth - parentPaddingX;
        availableHeight = node.parentElement.clientHeight - parentPaddingY;
      }

      if (availableWidth <= 0 || availableHeight <= 0) return;

      let currentSize = maxFontSize;

      // --- РЕЖИМ 1: ДЛЯ ВОПРОСА (DOM Клонирование с учетом <code>) ---
      if (mode === 'dom') {
        const clone = node.cloneNode(true) as HTMLElement;
        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.width = `${availableWidth}px`;
        clone.style.height = 'auto';
        clone.style.maxHeight = 'none';
        document.body.appendChild(clone);

        while (currentSize > minFontSize) {
          clone.style.fontSize = `${currentSize}px`;
          if (clone.offsetHeight <= availableHeight) {
            break;
          }
          currentSize -= step;
        }
        document.body.removeChild(clone);
      } 
      // --- РЕЖИМ 2: ДЛЯ ОПЦИЙ (Быстрый Canvas для чистых строк) ---
      else {
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

  useEffect(() => {
    if (elementRef.current) {
      adjustFontSize(elementRef.current);
    }
  }, [text, adjustFontSize, ...dependencies]);

  return { fontSize, isReady, ref: refCallback };
};
