export const parseQuestionContent = (
  fullText: string
): { inlineText: string; blockCode: string | null; blockLang: string | null } => {
  // 1. Блок ```lang\n...\n``` — вырезаем, берём первый
  const mdRegex = /```(\w*)\n?([\s\S]*?)```/;
  const match = fullText.match(mdRegex);

  const blockCode = match ? match[2].trim() : null;
  const blockLang = match ? match[1] || null : null;

  // 2. Всё остальное — инлайн, как есть
  const inlineText = fullText.replace(/```[\s\S]*?```/g, '').trim();

  return { inlineText, blockCode, blockLang };
};
