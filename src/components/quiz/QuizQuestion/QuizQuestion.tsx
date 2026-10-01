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

export function QuizQuestion({
  question,
}: QuizQuestionProps) {

  const { inlineText, blockCode, textForSizing } = useMemo(
    () => prepareQuestionContent(question.text),
    [question.text]
  );

  return (
          <div className=
            "w-full flex flex-col justify-center gap-3 items-center box-border py-1 flex-1 min-h-0 mt-2">
            {/* ТЕКСТ ВОПРОСА */}
            <QuestionText
              textForSizing={textForSizing}
              blockCode={blockCode}
              questionId={question.id}
              inlineText={inlineText}
            />
            {/* МНОГОСТРОЧНЫЙ БЛОК КОДА */}
            {blockCode && <QuestionCodeBlock code={blockCode} />}
          </div>
  );
}
