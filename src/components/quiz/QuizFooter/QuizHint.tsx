'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/feedback/Modal';
import { InlineCodeText } from '@/components/ui/core/InlineCodeText';

interface QuizHintProps {
  explanation: string;
}

export function QuizHint({ explanation }: QuizHintProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="z-50 flex h-9 w-12 items-center justify-center rounded-full border border-(--loom-cyan)/20 bg-(--loom-cyan)/10 text-lg text-(--loom-cyan) shadow-lg transition-colors hover:bg-(--loom-cyan)/20"
      >
        💡
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Объяснение">
        <p className="leading-relaxed text-(--loom-white)/80">
          <InlineCodeText value={explanation} />
        </p>
      </Modal>
    </>
  );
}
