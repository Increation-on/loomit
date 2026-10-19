'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useFormattedCode } from '@/hooks/useFormattedCode';

interface QuestionCodeBlockProps {
  code: string;
  lang?: string | null;
}

export function QuestionCodeBlock({ code, lang }: QuestionCodeBlockProps) {
  const { formatted, ref } = useFormattedCode(code, lang);

  return (
    <div
      ref={ref}
      className={
        'flex h-fit max-h-[45vh] w-full scrollbar-thin flex-col overflow-hidden rounded-xl border border-(--loom-white)/5 bg-[#1e1e1e] p-3 pr-1.5 shadow-inner ' +
        (formatted.includes('\n') ? 'justify-start' : 'justify-center')
      }
    >
      <SyntaxHighlighter
        language={lang || 'javascript'}
        style={oneDark}
        customStyle={{
          background: 'transparent',
          margin: 0,
          padding: 0,
          fontSize: '0.875rem',
          lineHeight: '1.6',
          overflow: 'auto',
        }}
        codeTagProps={{ className: 'font-mono' }}
        wrapLongLines
      >
        {formatted}
      </SyntaxHighlighter>
    </div>
  );
}
