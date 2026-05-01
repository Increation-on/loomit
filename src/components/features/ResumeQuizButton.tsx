'use client';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { selectQuizState } from '@/store/slices/quizSlice';
import { Button } from '@/components/ui/core/Button';

export function ResumeQuizButton() {
  const { currentQuiz, questions, isFinished } = useSelector(selectQuizState);

  if (!currentQuiz || isFinished || questions.length === 0) {
    return null;
  }

  return (
    <Link href={`/quiz/${currentQuiz.id}`}>
      <Button variant="outline" className="w-full">
        Продолжить квиз: {currentQuiz.title}
      </Button>
    </Link>
  );
}