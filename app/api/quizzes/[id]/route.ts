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
        category: true,
        questions: {
          select: {
            id: true,
            text: true,
            options: true,
            correct_option_id: true,
            explanation: true, // ✅ добавляем
            order: true,
          },
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
        const parsed = typeof q.options === 'string'
          ? JSON.parse(q.options)
          : q.options;

        const optionsArray = Array.isArray(parsed) ? parsed : [];

        const options = optionsArray.map((opt: any, idx: number) => {
          if (typeof opt === 'string') {
            return { id: String(idx + 1), text: opt };
          }
          return opt;
        });

        const correctOption = options.find(
          (opt: any) => opt.id === q.correct_option_id
        );

        return {
          ...q,
          options,
          correctOptionId: correctOption?.id || q.correct_option_id,
        };
      }),
    };

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}