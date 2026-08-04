import { NextResponse } from 'next/server';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { adminQuizCreateSchema } from '@/lib/validators/quiz';
import z from 'zod';

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
  
  // ✅ Сначала валидируем
  const validated = adminQuizCreateSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { error: z.treeifyError(validated.error) },
      { status: 400 }
    );
  }

  const { title, description, categoryId, level, questions } = validated.data;

  // ✅ Проверяем наличие категории
  if (!categoryId) {
    return NextResponse.json({ error: 'Category is required' }, { status: 400 });
  }
console.log('📤 Вопросы с объяснениями:', JSON.stringify(questions, null, 2));
  const quiz = await prisma.quiz.create({
    data: {
      id: crypto.randomUUID(),
      title,
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
          explanation: q.explanation, // ✅ ВОТ ЭТА СТРОКА
          order: index,
        })),
      },
    },
    include: { questions: true },
  });

  return NextResponse.json(quiz, { status: 201 });
}