// app\api\profile\stats\attempts\route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '5');
  const skip = (page - 1) * limit;

  const [attempts, total] = await Promise.all([
    prisma.attempt.findMany({
      where: { user_id: session.user.id },
      include: { quiz: { select: { title: true } } },
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
    }),
    prisma.attempt.count({ where: { user_id: session.user.id } }),
  ]);

  const formatted = attempts.map((a) => ({
    id: a.id,
    quizTitle: a.quiz.title,
    score: a.score,
    totalQuestions: a.total_questions,
    syncStatus: a.sync_status,
    createdAt: a.created_at,
  }));

  return NextResponse.json({
    attempts: formatted,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
}