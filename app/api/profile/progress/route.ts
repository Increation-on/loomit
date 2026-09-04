// app/api/profile/progress/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Удаляем все попытки пользователя
    await prisma.attempt.deleteMany({
      where: { user_id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to reset progress:', error);
    return NextResponse.json(
      { error: 'Failed to reset progress' },
      { status: 500 }
    );
  }
}
