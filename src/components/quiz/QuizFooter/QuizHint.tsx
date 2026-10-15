'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/feedback/Modal';
import { parseInlineCode, type InlineCodeSegment } from '@/lib/utils/quiz/parseInlineCode';

interface QuizHintProps {
  explanation: string;
}

const renderSegments = (segments: InlineCodeSegment[]) => {
  return segments.map((segment, i) => {
    if (segment.type === 'code') {
      return (
        <code
          key={i}
          className="font-mono bg-(--loom-white)/10 px-1.5 py-0.5 rounded text-(--loom-yellow) inline whitespace-nowrap font-semibold align-baseline mx-0.5 text-[0.9em]"
        >
          {segment.value}
        </code>
      );
    }
    return <span key={i}>{segment.value}</span>;
  });
};

export function QuizHint({ explanation }: QuizHintProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="z-50 flex items-center justify-center w-12 h-9 rounded-full bg-(--loom-cyan)/10 hover:bg-(--loom-cyan)/20 text-(--loom-cyan) text-lg transition-colors border border-(--loom-cyan)/20 shadow-lg"
      >
        💡
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Объяснение"
      >
        <p className="text-(--loom-white)/80 leading-relaxed">
          {renderSegments(parseInlineCode(explanation))}
        </p>
      </Modal>
    </>
  );
}