export const parseQuestionContent = (fullText: string): { inlineText: string } => {
  // Удаляем все блоки кода, если они остались в тексте (страховка для старых квизов)
  const inlineText = fullText.replace(/```[\s\S]*?```/g, '').trim();
  return { inlineText };
};
