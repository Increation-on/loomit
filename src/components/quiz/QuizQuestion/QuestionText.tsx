'use client'

import { useQuizFontSize } from "@/hooks/useQuizFontSize";
import { cn } from "@/lib/utils";
import { parseInlineCode, type InlineCodeSegment } from "@/lib/utils/quiz/parseInlineCode";

interface QuestionTextProps {
    inlineText: string;      // текст с бэктиками (после парсинга)
    textForSizing: string;   // текст без бэктиков (для измерения)
    questionId: string;      // для dependencies в хуке
    blockCode: string | null;
}

const renderSegments = (segments: InlineCodeSegment[], fontSize: number) => {
    return segments.map((segment, i) => {
        if (segment.type === 'code') {
            return (
                <code
                    key={i}
                    style={{ fontSize: Math.max(fontSize * 0.9, 13) + 'px' }}
                    className="font-mono bg-(--loom-white)/10 px-1.5 py-0.5 rounded text-(--loom-yellow) inline whitespace-nowrap font-semibold align-baseline mx-0.5"
                >
                    {segment.value}
                </code>
            );
        }
        return <span key={i} className="whitespace-normal">{segment.value}</span>;
    });
};

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
                {renderSegments(parseInlineCode(inlineText), fontSize)}
            </h2>
        </div>
    )
}