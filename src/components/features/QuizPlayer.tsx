import { useHasMounted } from '@/hooks/useHasMounted';
import { useParams } from 'next/navigation';
import { QuizContent } from './QuizContent';

export function QuizPlayer() {
  const hasMounted = useHasMounted();
  const { id } = useParams();

  if (!hasMounted) {
    return <div className="p-4 text-center text-loom-white">Загрузка квиза...</div>;
  }

  return <QuizContent id={id as string} />;
}