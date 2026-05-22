import { NextResponse } from 'next/server';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const quizzes = await prisma.quizzes.findMany({
    include: {
      _count: { select: { questions: true } },
    },
    orderBy: { updated_at: 'desc' },
  });

  return NextResponse.json(quizzes);
}