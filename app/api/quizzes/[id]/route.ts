export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const transformed = {
      ...quiz,
      questions: quiz.questions.map((q) => {
        const originalOptions = q.options as Array<{ id: string; text: string }>;
        const textOptions = originalOptions.map((opt) => opt.text);
        const correctOption = originalOptions.find((opt) => opt.id === q.correct_option_id);

        return {
          ...q,
          options: textOptions,
          correctOptionId: correctOption?.text || q.correct_option_id,
        };
      }),
    };

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}