import { cn } from "@/lib/utils";

interface QuestionCodeBlockProps {
    code: string;
}

export function QuestionCodeBlock({ code }: QuestionCodeBlockProps) {
    return (
        <div
            className={cn(
                "w-full flex-1 min-h-0 bg-[#1e1e1e] rounded-xl p-3 border border-(--loom-white)/5 shadow-inner scrollbar-thin pr-1.5 flex flex-col",
                code.includes('\n') ? "justify-start" : "justify-center"
            )}
        >
            <pre className="font-mono text-[13px] text-(--loom-yellow) text-left whitespace-pre-wrap break-words leading-relaxed selection:bg-white/20 w-full overflow-y-auto">
                <code className="block">{code}</code>
            </pre>
        </div>
    )
}