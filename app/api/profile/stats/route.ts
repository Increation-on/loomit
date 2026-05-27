// app/api/profile/stats/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  const [totalAttempts, avgResult] = await Promise.all([
    prisma.attempt.count({ where: { user_id: userId } }),
    prisma.attempt.aggregate({
      where: { user_id: userId },
      _avg: { score: true },
    }),
  ]);

  const totalQuestions = await prisma.attempt.aggregate({
    where: { user_id: userId },
    _sum: { total_questions: true },
  });

  return NextResponse.json({
    totalAttempts,
    averageScore: avgResult._avg.score
      ? Math.round((avgResult._avg.score / (totalQuestions._sum.total_questions || 1)) * 100)
      : 0,
  });
}