interface QuizProgressProps {
  currentIndex: number;
  total: number;
}

export function QuizProgress({ currentIndex, total }: QuizProgressProps) {
  return (
    <div className="mt-2 flex w-full items-center gap-4 text-sm text-(--loom-white)/60">
      <span className="whitespace-nowrap">
        Вопрос {currentIndex + 1} из {total}
      </span>
      <div className="h-1 min-w-10 flex-1 overflow-hidden rounded-full bg-(--loom-white)/10">
        <div
          className="h-full bg-(--loom-cyan) transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>
      <span className="font-semibold whitespace-nowrap text-(--loom-cyan)">
        {Math.round(((currentIndex + 1) / total) * 100)}%
      </span>
    </div>
  );
}
