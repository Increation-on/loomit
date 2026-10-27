'use client';

import { useMemo } from 'react';
import { prepareQuestionContent } from '@/lib/utils/quiz';
import { QuestionCodeBlock } from './QuestionCodeBlock';
import { QuestionText } from './QuestionText';

interface QuizQuestionProps {
  question: {
    id: string;
    text: string;
    code?: string | null;     
    codeLang?: string | null;
  };
}

export function QuizQuestion({ question }: QuizQuestionProps) {
  // Теперь достаем только inlineText и textForSizing
  const { inlineText, textForSizing } = useMemo(
    () => prepareQuestionContent(question.text),
    [question.text]
  );

  // Флаг наличия кода для правильной верстки (центрирования)
  const hasCode = Boolean(question.code);

  return (
    <div className="mt-2 box-border flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-3 py-1">
      <QuestionText
        textForSizing={textForSizing}
        hasCode={hasCode}
        questionId={question.id}
        inlineText={inlineText}
      />
      {/* Рендерим блок кода, если он есть в поле code */}
      {question.code && <QuestionCodeBlock code={question.code} lang={question.codeLang} />}
    </div>
  );
}
