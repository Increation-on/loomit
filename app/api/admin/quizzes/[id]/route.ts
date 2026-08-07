import { NextResponse } from 'next/server';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
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

/**
 * PUT /api/admin/quizzes/[id]
 * 
 * Updates the quiz as an aggregate:
 * - updates quiz fields (title, description, category, level)
 * - creates new questions
 * - updates existing questions (via deleteMany + create)
 * - removes deleted questions
 * 
 * Questions are child entities — they are saved only through the parent quiz.
 */
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

  // Delete old questions (they will be recreated from the new state)
  await prisma.question.deleteMany({ where: { quiz_id: id } });

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
          explanation: q.explanation,
          order: index,
        })),
      },
    },
    include: { questions: true, category: true },
  });

  return NextResponse.json(quiz);
}

/**
 * DELETE /api/admin/quizzes/[id]
 * 
 * Deletes the entire quiz.
 * All child entities (questions) are deleted automatically via Prisma cascade.
 * Attempts are deleted manually to avoid foreign key constraint violations.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Delete all attempts associated with this quiz first
  await prisma.attempt.deleteMany({ where: { quiz_id: id } });

  // Now delete the quiz (cascade will remove questions)
  await prisma.quiz.delete({ where: { id } });

  return NextResponse.json({ success: true });
}