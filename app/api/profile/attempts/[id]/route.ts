import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const attempt = await prisma.attempt.findUnique({
    where: { id },
    include: {
      quiz: {
        select: {
          title: true,
          questions: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              text: true,
              options: true,
              correct_option_id: true,
            },
          },
        },
      },
    },
  });

  if (!attempt || attempt.user_id !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let rawAnswers: any[] = [];
  if (typeof attempt.answers === 'string') {
    rawAnswers = JSON.parse(attempt.answers);
  } else if (Array.isArray(attempt.answers)) {
    rawAnswers = attempt.answers;
  }

  const formattedAnswers = rawAnswers.map((a: any, index: number) => {
  const question = attempt.quiz.questions[index] || null;

  let optionsArray: any[] = [];
  if (question?.options) {
    if (typeof question.options === 'string') {
      try {
        optionsArray = JSON.parse(question.options);
      } catch {
        optionsArray = [];
      }
    } else if (Array.isArray(question.options)) {
      optionsArray = question.options;
    }
  }

  return {
    id: a.id || index,
    questionText: question?.text || 'Вопрос',
    selectedOptionId: a.selectedOptionId || a.selected_option_id,
    isCorrect: a.isCorrect || a.is_correct,
    correctOptionId: question?.correct_option_id, // ✅ ВОТ ЭТО ДОБАВИТЬ
    options: optionsArray,
  };
});

  return NextResponse.json({
  id: attempt.id,
  quizTitle: attempt.quiz.title,
  score: attempt.score,
  totalQuestions: attempt.total_questions,
  syncStatus: attempt.sync_status,
  createdAt: attempt.created_at,
  answers: formattedAnswers,
});
}