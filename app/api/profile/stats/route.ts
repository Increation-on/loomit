// app/api/profile/stats/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  const [totalAttempts, attempts] = await Promise.all([
    prisma.attempt.count({ where: { user_id: userId } }),
    prisma.attempt.findMany({
      where: { user_id: userId },
      select: { score: true, total_questions: true },
    }),
  ]);

  // Считаем средний процент вручную
  let averageScore = 0;
  if (attempts.length > 0) {
    const totalPercentage = attempts.reduce((acc, a) => {
      return acc + (a.total_questions > 0 ? (a.score / a.total_questions) * 100 : 0);
    }, 0);
    averageScore = Math.round(totalPercentage / attempts.length);
  }

  return NextResponse.json({
    totalAttempts,
    averageScore,
  });
}
