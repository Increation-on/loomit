'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl    } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

interface QuestionCodeBlockProps {
  code: string;
}

export function QuestionCodeBlock({ code }: QuestionCodeBlockProps) {
  return (
    <div
      className={cn(
        'w-full h-fit max-h-[45vh] bg-[#1e1e1e] rounded-xl p-3 border border-(--loom-white)/5 shadow-inner scrollbar-thin pr-1.5 flex flex-col overflow-hidden',
        code.includes('\n') ? 'justify-start' : 'justify-center'
      )}
    >
      <SyntaxHighlighter
        language="javascript"
        style={nightOwl}
        customStyle={{
          background: 'transparent',
          margin: 0,
          padding: 0,
          fontSize: '0.875rem',
          lineHeight: '1.6',
          overflow: 'auto',
        }}
        codeTagProps={{
          className: 'font-mono',
        }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}