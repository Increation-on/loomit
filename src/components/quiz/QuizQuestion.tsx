'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/core/Button';
import { QuizOption } from './QuizOption';
import { Check, X } from 'lucide-react';
import { useQuizFontSize } from '@/hooks/useQuizFontSize';
import { cn } from '@/lib/utils';
import { formatCode } from '@/lib/utils/quiz';

interface QuizQuestionProps {
  question: {
    id: string;
    text: string;
    options: any[];
    correctOptionId: string;
    explanation?: string;
  };

  currentAnswer?: {
    selectedOptionId: string;
    isCorrect: boolean;
  } | null;

  selectedOption: string | null;

  onSelectOption: (optionId: string) => void;
  onConfirm: () => void;
  onNext: () => void;
  onFinish: () => void;

  isLast: boolean;
  currentIndex: number;
  total: number;

  optionLetters: string[];
  isPWA?: boolean;
  isSubmitting?: boolean;
}

// ✂️ Интеллектуальный парсер: изолирует исполняемый/длинный код в blockCode и сохраняет пробелы текста
const parseQuestionContent = (fullText: string): { inlineText: string; blockCode: string | null } => {
  const parts = fullText.split(/(`[^`]+`)/g);
  let blockCode: string | null = null;
  const inlineTextParts: string[] = [];

  parts.forEach((part) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const rawCode = part.slice(1, -1);
      const formatted = formatCode(rawCode);
      
      const isExecutableOrLong = 
        formatted.includes('\n') || 
        formatted.length > 25 || 
        formatted.includes('.') || 
        formatted.includes(';');

      if (isExecutableOrLong) {
        blockCode = formatted;
      } else {
        // Оставляем короткую переменную или тип данных (`null`, `undefined`, `a`)
        inlineTextParts.push('`' + formatted + '`');
      }
    } else {
      // Сохраняем текст и пробелы предложения в исходном состоянии
      inlineTextParts.push(part);
    }
  });

  return {
    inlineText: inlineTextParts.join('').trim(),
    blockCode,
  };
};

// 🎨 Рендеринг ультра-короткого инлайна без разрывов внутри команд
const formatQuestionInlineText = (text: string, fontSize: number) => {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const code = part.slice(1, -1);
      return (
        <code
          key={i}
          style={{ fontSize: Math.max(fontSize * 0.9, 13) + 'px' }}
          className="font-mono bg-(--loom-white)/10 px-1.5 py-0.5 rounded text-(--loom-yellow) inline whitespace-nowrap font-semibold align-baseline mx-0.5"
        >
          {code}
        </code>
      );
    }
    return <span key={i} className="whitespace-normal">{part}</span>;
  });
};

export function QuizQuestion({
  question,
  currentAnswer,
  selectedOption,
  onSelectOption,
  onConfirm,
  onNext,
  onFinish,
  isLast,
  optionLetters,
  isPWA = false,
  isSubmitting = false,
}: QuizQuestionProps) {
  const isCurrentConfirmed = !!currentAnswer;

  // 1. Изолируем блочный код от текстового заголовка h2
  const { inlineText, blockCode } = useMemo(
    () => parseQuestionContent(question.text),
    [question.text]
  );

  const textForSizing = useMemo(
    () => inlineText.replace(/`/g, ' '),
    [inlineText]
  );

  // 2. Хук замеряет исключительно текстовую часть вопроса
  const { fontSize, ref: questionRef } = useQuizFontSize({
    text: textForSizing,
    minFontSize: 18, 
    maxFontSize: 24,
    step: 0.5,
    mode: 'canvas',
    dependencies: [question.id, inlineText],
  });

  const alignClass = inlineText.length > 50 ? 'text-left' : 'text-center';

  return (
    <div className="flex flex-col h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {/* 🔑 КОНТЕЙНЕР: Строго фиксированная h-36 */}
          <div className="h-36 max-h-36 flex flex-col justify-center items-center -mt-4 mb-4 gap-2 overflow-hidden box-border py-1">
            
            {/* ТЕКСТ ВОПРОСА */}
            <div className={cn("w-full", !blockCode ? "h-full flex flex-col justify-center" : "h-auto")}>
              <h2
                ref={questionRef}
                className={cn(
                  'w-full font-bold text-(--loom-white) break-words transition-all duration-150 block text-center',
                  blockCode && alignClass
                )}
                style={{
                  fontSize: fontSize + 'px',
                  lineHeight: '1.4',
                }}
              >
                {formatQuestionInlineText(inlineText, fontSize)}
              </h2>
            </div>

            {/* МНОГОСТРОЧНЫЙ / ИСПОЛНЯЕМЫЙ БЛОК КОДА */}
            {blockCode && (
              <div 
                className={cn(
                  "w-full flex-1 min-h-0 bg-[#1e1e1e] rounded-xl p-3 border border-(--loom-white)/5 shadow-inner scrollbar-thin pr-1.5 flex flex-col",
                  // 🔑 НАДЕЖНЫЙ ФИКС: Явно приводим blockCode к string, чтобы TypeScript не ругался на type never
                  (blockCode as string).includes('\n') ? "justify-start" : "justify-center"
                )}
              >
                <pre className="font-mono text-[13px] text-(--loom-yellow) text-left whitespace-pre-wrap break-words leading-relaxed selection:bg-white/20 w-full overflow-y-auto">
                  <code className="block">{blockCode}</code>
                </pre>
              </div>
            )}
          </div>

          {/* ВАРИАНТЫ ОТВЕТОВ */}
          <div className="flex flex-col gap-3 w-full mx-auto">
            {question.options.map((opt: any, idx: number) => {
              const isSelected = selectedOption === opt.id;
              const isCorrectOption = question.correctOptionId === opt.id;
              const isWrong =
                currentAnswer?.selectedOptionId === opt.id &&
                !currentAnswer?.isCorrect;

              let icon = null;

              if (isCurrentConfirmed) {
                if (isCorrectOption) {
                  icon = <Check size={18} className="text-(--loom-cyan) ml-auto" />;
                } else if (isWrong) {
                  icon = <X size={18} className="text-(--glitch-pink) ml-auto" />;
                }
              }

              return (
                <QuizOption
                  key={idx}
                  letter={optionLetters[idx]}
                  text={opt.text}
                  isSelected={isSelected}
                  isCurrentConfirmed={isCurrentConfirmed}
                  isCorrect={isCorrectOption}
                  isWrong={isWrong}
                  icon={icon}
                  onClick={() => {
                    if (!isCurrentConfirmed && !isSubmitting) {
                      onSelectOption(opt.id);
                    }
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* КНОПКИ ДЕЙСТВИЯ */}
      <div
        className={cn(
          'bottom-1 left-0 right-0 bg-(--loom-black)/90 backdrop-blur-sm border-t border-(--loom-white)/10 flex justify-center z-50 py-4',
          isPWA ? 'fixed' : 'sticky'
        )}
      >
        {!isCurrentConfirmed ? (
          <Button
            variant="glitch"
            onClick={onConfirm}
            disabled={!selectedOption || isSubmitting}
            className="px-12 py-2.5 text-base min-w-40"
          >
            {isSubmitting ? 'Ждем...' : 'Ответить'}
          </Button>
        ) : isLast ? (
          <Button
            variant="glitch"
            onClick={onFinish}
            disabled={isSubmitting}
            className="px-12 py-2.5 text-base min-w-40"
          >
            Завершить
          </Button>
        ) : (
          <Button
            variant="glitch"
            onClick={onNext}
            disabled={isSubmitting}
            className="px-12 py-2.5 text-base min-w-40"
          >
            Далее
          </Button>
        )}
      </div>
    </div>
  );
}
