import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { id, quizId, score, totalQuestions, answers } = body;

    const attempt = await prisma.attempt.create({
      data: {
        id, // ✅ используем переданный с клиента ID
        user_id: session?.user?.id,
        guest_id: !session?.user?.id ? `guest_${Date.now()}` : undefined,
        quiz_id: quizId,
        score,
        total_questions: totalQuestions,
        answers: JSON.stringify(answers),
        sync_status: 'synced',
      },
    });

    return NextResponse.json({ success: true, attempt });
  } catch (error) {
    console.error('Save attempt error:', error);
    return NextResponse.json({ error: 'Failed to save attempt' }, { status: 500 });
  }
}
