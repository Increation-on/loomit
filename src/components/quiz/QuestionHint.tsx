'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/feedback/Modal';

interface QuestionHintProps {
  explanation: string;
}

export function QuestionHint({ explanation }: QuestionHintProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
         className="z-50 flex items-center justify-center w-13 h-10 rounded-full bg-(--loom-cyan)/10 hover:bg-(--loom-cyan)/20 text-(--loom-cyan) text-lg transition-colors border border-(--loom-cyan)/20 shadow-lg"
      >
        💡
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Объяснение"
      >
        <p className="text-(--loom-white)/80 leading-relaxed">{explanation}</p>
      </Modal>
    </>
  );
}