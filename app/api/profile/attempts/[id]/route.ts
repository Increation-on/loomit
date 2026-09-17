import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
    select: {
      id: true,
      user_id: true,
      quiz_id: true,
      score: true,
      total_questions: true,
      answers: true,
      sync_status: true,
      created_at: true,
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
              explanation: true,
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
    const questionText = a.questionText;

    // 🔑 Ищем вопрос по тексту, а не по индексу
    // (потому что ответы идут в порядке прохождения, а вопросы — в порядке order)
    const question = attempt.quiz.questions.find(
      (q: any) => q.text === questionText
    ) || null;

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
      questionText: question?.text || a.questionText || 'Вопрос',
      selectedOptionId: a.selectedOptionId || a.selected_option_id,
      selectedOptionText: a.selectedOptionText || a.selected_option_text,
      isCorrect: a.isCorrect ?? a.is_correct,
      correctOptionId: a.correctOptionId || question?.correct_option_id,
      correctOptionText: a.correctOptionText || a.correct_option_text,
      explanation: question?.explanation || null, // ← объяснение сразу в ответе
      options: optionsArray,
    };
  });

  return NextResponse.json({
    id: attempt.id,
    quiz_id: attempt.quiz_id,
    quizTitle: attempt.quiz.title,
    score: attempt.score,
    totalQuestions: attempt.total_questions,
    syncStatus: attempt.sync_status,
    createdAt: attempt.created_at,
    answers: formattedAnswers,
  });
}