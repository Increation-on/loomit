import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const quizId = req.nextUrl.searchParams.get('quizId');
  if (!quizId) {
    return NextResponse.json({ error: 'quizId required' }, { status: 400 });
  }

  const favorite = await prisma.favorite.findUnique({
    where: {
      user_id_quiz_id: {
        user_id: session.user.id,
        quiz_id: quizId,
      },
    },
  });

  return NextResponse.json({ favorited: !!favorite });
}
