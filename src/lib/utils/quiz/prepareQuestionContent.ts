import { parseQuestionContent } from './parseQuestionContent';

export function prepareQuestionContent(text: string) {
  const { inlineText } = parseQuestionContent(text);
  const textForSizing = inlineText.replace(/`/g, ' ');
  return { inlineText, textForSizing };
}
