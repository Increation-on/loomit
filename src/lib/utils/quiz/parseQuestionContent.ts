import { formatCode } from "./formatCode";

export const parseQuestionContent = (fullText: string): { inlineText: string; blockCode: string | null } => {
  let blockCode: string | null = null;
  let text = fullText;

  // 1. Markdown-блоки ```lang\n...\n```
  const mdRegex = /```(\w*)\n?([\s\S]*?)```/g;
  text = text.replace(mdRegex, (_, lang, code) => {
    const trimmed = code.trim();
    if (trimmed) {
      blockCode = formatCode(trimmed);
    }
    return '';
  });

  // 2. Одинарные бэктики (старая логика)
  const parts = text.split(/(`[^`]+`)/g);
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
        inlineTextParts.push('`' + formatted + '`');
      }
    } else {
      inlineTextParts.push(part);
    }
  });

  return {
    inlineText: inlineTextParts.join('').trim(),
    blockCode,
  };
};