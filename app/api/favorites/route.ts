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

  try {
    // Пытаемся удалить запись по составному ключу (если она есть)
    const deleted = await prisma.favorite.deleteMany({
      where: {
        user_id: session.user.id,
        quiz_id: quizId,
      },
    });

    // Если удалили хотя бы одну запись — значит она была в избранном
    if (deleted.count > 0) {
      return NextResponse.json({ favorited: false });
    }

    // Если не удалили — значит её не было, добавляем
    await prisma.favorite.create({
      data: {
        user_id: session.user.id,
        quiz_id: quizId,
      },
    });

    return NextResponse.json({ favorited: true });

  } catch (error) {
    console.error('🔥 Ошибка в POST /api/favorites:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}