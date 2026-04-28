'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { QuizPlayer } from '@/components/features/QuizPlayer';
import { startQuiz } from '@/store/slices/quizSlice';
import { selectQuizState } from '@/store/slices/quizSlice';

export default function QuizPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentQuiz, questions } = useSelector(selectQuizState);

  useEffect(() => {
    // Загружаем квиз ТОЛЬКО если:
    // 1. В сторе нет квиза
    // 2. ИЛИ это другой квиз (другой id)
    if (!currentQuiz || currentQuiz.id !== id) {
      fetch(`/api/quizzes/${id}`)
        .then(res => res.json())
        .then(quiz => {
          dispatch(startQuiz({
            quiz: { id: quiz.id, title: quiz.title },
            questions: quiz.questions,
          }));
        });
    }
  }, [id, currentQuiz, dispatch]);

  return <QuizPlayer />;
}