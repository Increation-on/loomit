'use client';

import { parseInlineCode } from '@/lib/utils/quiz';

interface InlineCodeTextProps {
  value: string;
  /** Если задан — размер кода в px; если нет — наследуется через em от родителя */
  fontSize?: number;
  /** Классы для текстовых (некодовых) сегментов */
  textClassName?: string;
}

export function InlineCodeText({ value, fontSize, textClassName }: InlineCodeTextProps) {
  const segments = parseInlineCode(value);

  return (
    <>
      {segments.map((segment, i) => {
        if (segment.type === 'code') {
          const style =
            fontSize !== undefined
              ? { fontSize: Math.max(fontSize * 0.9, 12) + 'px' }
              : undefined;

          return (
            <code
              key={i}
              style={style}
              className="font-mono bg-(--loom-white)/10 px-1.5 py-0.5 rounded text-(--loom-yellow) inline whitespace-nowrap font-semibold align-baseline mx-0.5 text-[0.9em]"
            >
              {segment.value}
            </code>
          );
        }
        return (
          <span key={i} className={textClassName}>
            {segment.value}
          </span>
        );
      })}
    </>
  );
}
