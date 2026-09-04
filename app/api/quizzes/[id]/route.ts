// app/api/quizzes/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';


export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        category: true,
        questions: {
          select: {
            id: true,
            text: true,
            options: true,
            correct_option_id: true,
            explanation: true,
            order: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    let activeAttemptId = null;
    let otherAttempt = null;

    if (userId) {
      const allActiveAttempts = await prisma.attempt.findMany({
        where: { user_id: userId, status: 'IN_PROGRESS' },
        include: { quiz: { select: { title: true } } },
        orderBy: { created_at: 'desc' },
      });

      if (allActiveAttempts.length > 0) {
        const globalActiveAttempt = allActiveAttempts[0];

        if (globalActiveAttempt.quiz_id === quizId) {
          activeAttemptId = globalActiveAttempt.id;
        } else {
          otherAttempt = {
            id: globalActiveAttempt.id,
            quizId: globalActiveAttempt.quiz_id,
            quizTitle: globalActiveAttempt.quiz.title,
          };
        }
      }
    }

    return NextResponse.json(
      {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        level: quiz.level,
        questions: quiz.questions,
        activeAttemptId,
        otherAttempt,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error) {
    console.error('[BG-GET] Ошибка API:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}