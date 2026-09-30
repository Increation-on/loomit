interface QuizProgressProps {
  currentIndex: number;
  total: number;
  
}

export function QuizProgress({ currentIndex, total }: QuizProgressProps) {
  return (
    <div className="flex items-center gap-4 text-(--loom-white)/60 text-sm w-full mt-2">
          <span className="whitespace-nowrap">
            Вопрос {currentIndex + 1} из {total}
          </span>
          <div className="flex-1 h-1 bg-(--loom-white)/10 rounded-full overflow-hidden min-w-10">
            <div
              className="h-full bg-(--loom-cyan) transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            />
          </div>
          <span className="text-(--loom-cyan) font-semibold whitespace-nowrap">
            {Math.round(((currentIndex + 1) / total) * 100)}%
          </span>
        </div>
  );
}