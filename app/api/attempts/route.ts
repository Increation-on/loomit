// app/api/attempts/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { quizId, score, totalQuestions, answers } = body;

    const attempt = await prisma.attempt.create({
      data: {
        userId: session?.user?.id,
        guestId: !session?.user?.id ? `guest_${Date.now()}` : undefined,
        quizId,
        score,
        totalQuestions,
        answers: JSON.stringify(answers),
        syncStatus: 'synced',
      },
    });

    return NextResponse.json({ success: true, attempt });
  } catch (error) {
    console.error('Save attempt error:', error);
    return NextResponse.json({ error: 'Failed to save attempt' }, { status: 500 });
  }
}