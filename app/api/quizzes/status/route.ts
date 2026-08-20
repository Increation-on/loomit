import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { quizIds } = await req.json();

  const attempts = await prisma.attempt.findMany({
    where: {
      user_id: session.user.id,
      quiz_id: { in: quizIds },
    },
    orderBy: { created_at: 'desc' },
    distinct: ['quiz_id'],
  });

  const statusMap: Record<string, any> = {};
  attempts.forEach((a) => {
    statusMap[a.quiz_id] = {
      score: a.score,
      totalQuestions: a.total_questions,
    };
  });

  return NextResponse.json(statusMap);
}
