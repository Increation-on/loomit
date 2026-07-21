import { useHasMounted } from '@/hooks/useHasMounted';
import { useParams } from 'next/navigation';
import { QuizContent } from './QuizContent';
import { Skeleton } from '@/components/ui/feedback/Skeleton';

export function QuizPlayer() {
  const hasMounted = useHasMounted();
  const { id } = useParams();

  if (!hasMounted) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-full" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return <QuizContent id={id as string} />;
}