'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { QuizPlayer } from '@/components/features/QuizPlayer';
import { startQuiz } from '@/store/slices/quizSlice';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

export default function QuizPageWrapper() {
  const params = useParams();
  const dispatch = useDispatch();
  const id = params.id as string;

  useEffect(() => {
    fetch(`/api/quizzes/${id}`)
      .then(res => res.json())
      .then(quiz => {
        dispatch(startQuiz({
          quiz: { id: quiz.id, title: quiz.title },
          questions: quiz.questions,
        }));
      });
  }, [id, dispatch]);

  return (
    <Provider store={store}>
      <QuizPlayer />
    </Provider>
  );
}