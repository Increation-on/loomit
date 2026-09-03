import { useParams } from 'next/navigation';
import { QuizContent } from './QuizContent';

export function QuizPlayer() {
  const { id } = useParams();

  return (
    <div className="w-full">
      <QuizContent id={id as string} />
    </div>
  );
} 