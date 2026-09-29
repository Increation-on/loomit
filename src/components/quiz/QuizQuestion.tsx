'use client';

import { useMemo } from 'react';
import { prepareQuestionContent } from '@/lib/utils/quiz';
import { QuestionCodeBlock } from './question/QuestionCodeBlock';
import { QuestionText } from './question/QuestionText';

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
            "w-full flex flex-col justify-center items-center -mt-4 mb-4 gap-2 box-border py-1 h-50">
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
