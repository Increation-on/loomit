//app\api\admin\quizzes\[id]\route.ts

import { NextResponse } from 'next/server';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

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
    },
  });

  if (!quiz) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const formatted = {
    ...quiz,
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
  const { title, description, questions } = body;

  await prisma.question.deleteMany({ where: { quiz_id: id } });

  const quiz = await prisma.quiz.update({
    where: { id },
    data: {
      title,
      description,
      updated_at: new Date(),
      questions: {
        create: questions.map((q: any, index: number) => ({
          id: crypto.randomUUID(),
          text: q.text,
          options: JSON.stringify(q.options.map((o: any) => o.text)),
          correct_option_id: q.correctOptionId,
          order: index,
        })),
      },
    },
    include: { questions: true },
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