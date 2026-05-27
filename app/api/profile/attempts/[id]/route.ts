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
      quiz: { select: { title: true } },
    },
  });

  if (!attempt || attempt.user_id !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let answers: any[] = [];
  if (typeof attempt.answers === 'string') {
    answers = JSON.parse(attempt.answers);
  } else if (Array.isArray(attempt.answers)) {
    answers = attempt.answers;
  }

  return NextResponse.json({
    id: attempt.id,
    quizTitle: attempt.quiz.title,
    score: attempt.score,
    totalQuestions: attempt.total_questions,
    syncStatus: attempt.sync_status,
    createdAt: attempt.created_at,
    answers,
  });
}