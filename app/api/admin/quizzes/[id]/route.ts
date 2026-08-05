import { NextResponse } from 'next/server';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { adminQuizCreateSchema } from '@/lib/validators/quiz';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: 'asc' },
      },
      category: true,
    },
  });

  if (!quiz) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const formatted = {
    ...quiz,
    category_id: quiz.category_id,
    category_name: quiz.category?.name,
    level: quiz.level,
    questions: quiz.questions.map((q: any) => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
    })),
  };

  return NextResponse.json(formatted);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();

  // Валидируем входящие данные
  const validated = adminQuizCreateSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { error: z.treeifyError(validated.error) },
      { status: 400 }
    );
  }

  const { title, description, categoryId, level, questions } = validated.data;

  // Проверяем, что категория выбрана
  if (!categoryId) {
    return NextResponse.json({ error: 'Category is required' }, { status: 400 });
  }

  // Удаляем старые вопросы
  await prisma.question.deleteMany({ where: { quiz_id: id } });
console.log('📤 PUT body:', JSON.stringify(body, null, 2));
  // Обновляем квиз
  const quiz = await prisma.quiz.update({
    where: { id },
    data: {
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
    include: { questions: true, category: true },
  });

  return NextResponse.json(quiz);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  await prisma.quiz.delete({ where: { id } });

  return NextResponse.json({ success: true });
}