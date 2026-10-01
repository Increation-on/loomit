import { cn } from "@/lib/utils";

interface QuestionCodeBlockProps {
    code: string;
}

export function QuestionCodeBlock({ code }: QuestionCodeBlockProps) {
    return (
        <div className={cn(
            "w-full h-fit max-h-[45vh] bg-[#1e1e1e] rounded-xl p-3 border border-(--loom-white)/5 shadow-inner scrollbar-thin pr-1.5 flex flex-col flex-col overflow-hidden",
            code.includes('\n') ? "justify-start" : "justify-center"
        )}>
            <pre className="flex-1 min-h-0 font-mono text-sm text-(--loom-yellow) text-left whitespace-pre-wrap wrap-break-word leading-relaxed selection:bg-white/20 w-full overflow-y-auto">
                <code className="block">{code}</code>
            </pre>
        </div>
    )
}