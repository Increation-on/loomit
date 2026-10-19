'use client';

import { useMemo } from 'react';
import { prepareQuestionContent } from '@/lib/utils/quiz';
import { QuestionCodeBlock } from './QuestionCodeBlock';
import { QuestionText } from './QuestionText';

interface QuizQuestionProps {
  question: {
    id: string;
    text: string;
  };
}

export function QuizQuestion({ question }: QuizQuestionProps) {
  const { inlineText, blockCode, blockLang, textForSizing } = useMemo(
    () => prepareQuestionContent(question.text),
    [question.text]
  );

  return (
    <div className="mt-2 box-border flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-3 py-1">
      <QuestionText
        textForSizing={textForSizing}
        blockCode={blockCode}
        questionId={question.id}
        inlineText={inlineText}
      />
      {blockCode && <QuestionCodeBlock code={blockCode} lang={blockLang} />}
    </div>
  );
}
