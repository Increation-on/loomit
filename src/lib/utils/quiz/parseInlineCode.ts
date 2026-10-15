// src/lib/utils/quiz/parseInlineCode.ts

export type InlineCodeSegment =
  | { type: 'text'; value: string }
  | { type: 'code'; value: string }

/**
 * Делит строку на текстовые и кодовые сегменты.
 * Код — то, что обёрнуто в одиночные бэктики: `...`
 * Возвращает чистые данные, JSX не создаёт.
 */
export function parseInlineCode(text: string): InlineCodeSegment[] {
  const parts = text.split(/(`[^`]+`)/g);

  return parts
    .filter((part) => part.length > 0)
    .map((part) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return { type: 'code', value: part.slice(1, -1) };
      }
      return { type: 'text', value: part };
    });
}