import { NextResponse } from 'next/server';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { adminQuizCreateSchema } from '@/lib/validators/quiz';

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
      { error: validated.error.format() },
      { status: 400 }
    );
  }

  const { title, description, questions } = validated.data;

  const quiz = await prisma.quiz.create({
    data: {
      id: crypto.randomUUID(),
      title,
      description: description || '',
      updated_at: new Date(),
      questions: {
        create: questions.map((q, index) => ({
          id: crypto.randomUUID(),
          text: q.text,
          options: JSON.stringify(q.options.map(o => o.text)),
          correct_option_id: q.correctOptionId,
          order: index,
        })),
      },
    },
    include: { questions: true },
  });

  return NextResponse.json(quiz, { status: 201 });
}