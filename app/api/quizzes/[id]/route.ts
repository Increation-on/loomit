import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route'; // ⚠️ Если возникнет ошибка импорта, проверь этот путь до твоих authOptions
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;
    const session = await getServerSession(authOptions);

    // 1. Получаем квиз, категорию и дефолтные вопросы
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        category: true,
        questions: {
          select: {
            id: true,
            text: true,
            options: true,
            correct_option_id: true,
            explanation: true,
            order: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Трансформируем дефолтные варианты ответов (для новых стартов)
    const transformedQuestions = quiz.questions.map((q) => {
      const parsed = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
      const optionsArray = Array.isArray(parsed) ? parsed : [];

      const options = optionsArray.map((opt: any, idx: number) => {
        if (typeof opt === 'string') {
          return { id: String(idx + 1), text: opt };
        }
        return opt;
      });

      return {
        ...q,
        options,
        correctOptionId: q.correct_option_id || '',
      };
    });

    // 2. Ищем активную незавершенную попытку для этого юзера в БД
    let activeAttemptId = null;
    if (session?.user?.id) {
      const activeAttempt = await prisma.attempt.findFirst({
        where: {
          quiz_id: quizId,
          user_id: session.user.id,
          status: 'IN_PROGRESS',
        },
        orderBy: { created_at: 'desc' },
        select: { id: true },
      });
      
      activeAttemptId = activeAttempt?.id || null;
    }

    // 3. Возвращаем всё одним ответом без кэширования Next.js
    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      level: quiz.level,
      questions: transformedQuestions, 
      activeAttemptId, // Фронтенд сразу узнает, есть ли черновик в БД
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
