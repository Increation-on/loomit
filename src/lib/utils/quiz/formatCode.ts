// 🛠 Функция форматирования блочного кода: чистит пробелы в массивах, скобках и выравнивает строки
export const formatCode = (code: string): string => {
  if (!code) return '';
  if (code.includes('\n')) return code.trim();

  // 1. Сжатие пробелов внутри однострочных массивов ДО форматирования строк
  let cleanCode = code.trim().replace(/\[\s*([\s\S]*?)\s*\]/g, (_, p1) => {
    const compacted = p1.replace(/\s*,\s*/g, ', ');
    return '[' + compacted.trim() + ']';
  });

  // Очистка зазоров между скобками и точкой с запятой
  cleanCode = cleanCode.replace(/\]\s*;/g, '];').replace(/\}\s*;/g, '};');

  // Намертво схлопываем пустые фигурные скобки, чтобы внутри них не появлялся перенос
  cleanCode = cleanCode.replace(/\{\s*\}/g, '{}');

  // Если код короткий и плоский, возвращаем как есть
  if (cleanCode.length < 30 && !cleanCode.includes(';')) return cleanCode;

  // 2. Чистая расстановка переносов строк (lookahead (?!\}) защищает пустые скобки)
  const formatted = cleanCode
    .replace(/\{(?!\})/g, '{\n')
    .replace(/(?<!\{)\}/g, '\n}')
    .replace(/;(?![^(]*\))/g, ';\n')
    .replace(/\n\s*\n/g, '\n');

  // 3. Расчет контекстных табуляций (2 пробела на уровень отступа)
  const lines = formatted.split('\n');
  let currentIndent = 0;

  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';

    if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith('})')) {
      currentIndent = Math.max(0, currentIndent - 1);
    }

    const indentSpace = '  '.repeat(currentIndent);
    const result = indentSpace + trimmed;

    if (trimmed.endsWith('{') || trimmed.endsWith('[')) {
      currentIndent++;
    }

    return result;
  });

  return processedLines.filter(line => line !== '').join('\n');
};