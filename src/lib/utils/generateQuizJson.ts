import { resolveCodeLang } from './resolveCodeLang';

interface QuizDataForExport {
  title: string;
  description?: string;
  categoryName: string;
  level: string;
  questions: any[];
}

export function generateQuizJson(quizData: QuizDataForExport): string {
  // Собираем объект строго по схеме quizImportSchema
  const exportData = {
    title: quizData.title,
    description: quizData.description || undefined,
    categoryName: quizData.categoryName,
    level: quizData.level,
    questions: quizData.questions.map((q) => {
      // Подчищаем опции (оставляем только id и text)
      const options = (q.options || []).map((opt: any) => ({
        id: String(opt.id),
        text: opt.text,
      }));

      return {
        text: q.text,
        options,
        correctOptionId: String(q.correctOptionId),
        explanation: q.explanation || undefined,
        // Если код есть, добавляем его и язык. Если нет — не добавляем вообще (чистый JSON)
        ...(q.code
          ? {
              code: q.code,
              codeLang: resolveCodeLang(q.code, q.codeLang),
            }
          : {}),
      };
    }),
  };

  // Возвращаем красиво отформатированную строку (с отступами)
  return JSON.stringify(exportData, null, 2);
}
