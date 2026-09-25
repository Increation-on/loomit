import { formatCode } from "./formatCode";

// ✂️ Интеллектуальный парсер: изолирует исполняемый/длинный код в blockCode и сохраняет пробелы текста
export const parseQuestionContent = (fullText: string): { inlineText: string; blockCode: string | null } => {
  const parts = fullText.split(/(`[^`]+`)/g);
  let blockCode: string | null = null;
  const inlineTextParts: string[] = [];

  parts.forEach((part) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const rawCode = part.slice(1, -1);
      const formatted = formatCode(rawCode);
      
      const isExecutableOrLong = 
        formatted.includes('\n') || 
        formatted.length > 25 || 
        formatted.includes('.') || 
        formatted.includes(';');

      if (isExecutableOrLong) {
        blockCode = formatted;
      } else {
        // Оставляем короткую переменную или тип данных (`null`, `undefined`, `a`)
        inlineTextParts.push('`' + formatted + '`');
      }
    } else {
      // Сохраняем текст и пробелы предложения в исходном состоянии
      inlineTextParts.push(part);
    }
  });

  return {
    inlineText: inlineTextParts.join('').trim(),
    blockCode,
  };
};