export const resolveCodeLang = (code?: string | null, codeLang?: string | null): string | null => {
  if (!code || code.trim() === '') {
    return null;
  }
  return codeLang || 'js';
};
