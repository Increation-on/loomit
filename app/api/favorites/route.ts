import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET — список избранного для текущего пользователя
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
  where: { user_id: session.user.id },
  include: {
    quiz: {
      include: {
        category: true,
        questions: true,
      },
    },
  },
  orderBy: { created_at: 'desc' },
});

  return NextResponse.json(favorites);
}

// POST — добавить или удалить из избранного (toggle)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { quizId } = await req.json();
  if (!quizId) {
    return NextResponse.json({ error: 'quizId required' }, { status: 400 });
  }

  // Проверяем, есть ли уже
  const existing = await prisma.favorite.findUnique({
    where: {
      user_id_quiz_id: {
        user_id: session.user.id,
        quiz_id: quizId,
      },
    },
  });

  if (existing) {
    // Удаляем
    await prisma.favorite.delete({
      where: { id: existing.id },
    });
    return NextResponse.json({ favorited: false });
  } else {
    // Добавляем
    await prisma.favorite.create({
      data: {
        user_id: session.user.id,
        quiz_id: quizId,
      },
    });
    return NextResponse.json({ favorited: true });
  }
}