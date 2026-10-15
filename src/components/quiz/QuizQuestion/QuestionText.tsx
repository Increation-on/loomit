'use client'

import { InlineCodeText } from "@/components/ui/core/InlineCodeText";
import { useQuizFontSize } from "@/hooks/useQuizFontSize";
import { cn } from "@/lib/utils";

interface QuestionTextProps {
    inlineText: string;      // текст с бэктиками (после парсинга)
    textForSizing: string;   // текст без бэктиков (для измерения)
    questionId: string;      // для dependencies в хуке
    blockCode: string | null;
}

export function QuestionText({ 
    inlineText,
    blockCode,
    questionId,
    textForSizing

}: QuestionTextProps) {

    const { fontSize, ref: questionRef, isReady } = useQuizFontSize({
        text: textForSizing,
        minFontSize: 16,
        maxFontSize: 24,
        step: 0.5,
        mode: 'canvas',
        dependencies: [questionId, inlineText],
    });

    const alignClass = inlineText.length > 50 ? 'text-left' : 'text-center';

    return (
        <div className={cn("w-full shrink-0", !blockCode ? "h-full flex flex-col justify-center" : "h-auto")}>
            <h2
                ref={questionRef}
                className={cn(
                    'w-full font-bold text-(--loom-white) wrap-break-word transition-all duration-150 block text-center',
                    blockCode && alignClass
                )}
                style={{
                    fontSize: fontSize + 'px',
                    lineHeight: '1.4',
                    opacity: isReady ? '1' : '0',
                }}
            >
               <InlineCodeText value={inlineText} fontSize={fontSize} textClassName="whitespace-normal" />
            </h2>
        </div>
    )
}