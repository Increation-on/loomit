// app/api/admin/quizzes/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { adminQuizCreateSchema } from '@/lib/validators/quiz';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const quizzes = await prisma.quiz.findMany({
    include: { _count: { select: { questions: true } } },
    orderBy: { updated_at: 'desc' },
  });

  return NextResponse.json(quizzes);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();

  const validated = adminQuizCreateSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { error: validated.error.issues.map((i) => i.message).join(', ') },
      { status: 400 }
    );
  }

  const { title, description, categoryId, level, questions } = validated.data;

  if (!categoryId) {
    return NextResponse.json({ error: 'Category is required' }, { status: 400 });
  }

  // 🔑 Проверка на дубль по названию (регистронезависимая)
  const existing = await prisma.quiz.findFirst({
    where: {
      title: {
        equals: title.trim(),
        mode: 'insensitive',
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: `Квиз с названием «${title}» уже существует` },
      { status: 409 }
    );
  }

  try {
    const quiz = await prisma.quiz.create({
      data: {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description || '',
        category_id: categoryId,
        level,
        updated_at: new Date(),
        questions: {
          create: questions.map((q, index) => ({
            id: crypto.randomUUID(),
            text: q.text,
            options: q.options,
            correct_option_id: q.correctOptionId,
            explanation: q.explanation,
            order: index,
          })),
        },
      },
      include: { questions: true },
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error: any) {
    // Страховка от гонок на уровне БД (unique constraint)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: `Квиз с названием «${title}» уже существует` },
        { status: 409 }
      );
    }
    throw error;
  }
}