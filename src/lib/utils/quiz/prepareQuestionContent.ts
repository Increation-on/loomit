import { parseQuestionContent } from './parseQuestionContent';

export function prepareQuestionContent(text: string) {

  const { inlineText, blockCode, blockLang } = parseQuestionContent(text);

  const textForSizing = inlineText.replace(/`/g, ' ');
  
  return { inlineText, blockCode, blockLang, textForSizing };
}