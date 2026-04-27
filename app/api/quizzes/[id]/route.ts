import { NextResponse } from 'next/server';

const mockQuiz = {
  id: '1',
  title: 'React Basics',
  questions: [
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
  ],
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Временно игнорируем id, возвращаем мок
  return NextResponse.json(mockQuiz);
}