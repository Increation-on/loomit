'use client';
import { QuizPlayer } from '@/components/features/QuizPlayer';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { startQuiz } from '@/store/slices/quizSlice';

const mockQuiz = {
  id: '1',
  title: 'React Basics',
};

const mockQuestions = [
  {
    id: 'q1',
    text: 'Что такое JSX?',
    options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Xport', 'Javascript Xtra'],
    correctOptionId: 'JavaScript XML',
  },
  {
    id: 'q2',
    text: 'Какой хук используется для сайд-эффектов?',
    options: ['useState', 'useEffect', 'useReducer', 'useMemo'],
    correctOptionId: 'useEffect',
  },
];

// Диспатчим старт
store.dispatch(startQuiz({ quiz: mockQuiz, questions: mockQuestions }));

export default function QuizPage() {
  return (
    <Provider store={store}>
      <QuizPlayer />
    </Provider>
  );
}