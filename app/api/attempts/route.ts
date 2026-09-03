import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route'; // ⚠️ Если возникнет ошибка импорта, проверь этот путь до твоих authOptions
import { prisma } from '@/lib/prisma';
import { shuffle } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { id, quizId, guestId } = body;

    if (!quizId) {
      return NextResponse.json({ error: 'Не указан quizId' }, { status: 400 });
    }

    // 1. Сразу запрашиваем ВСЕ вопросы квиза со всеми полями
    const questions = await prisma.question.findMany({
      where: { quiz_id: quizId },
    });

    if (questions.length === 0) {
      return NextResponse.json({ error: 'Вопросы для квиза не найдены' }, { status: 404 });
    }

    // 2. Перемешиваем сами объекты вопросов на сервере
    const shuffledQuestions = shuffle([...questions]);
    const shuffledIds = shuffledQuestions.map((q) => q.id);

    // 3. Дополнительно шафлим варианты ответов (options) внутри каждого вопроса
    const questionsWithShuffledOptions = shuffledQuestions.map((q) => {
      const parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
      const optionsArray = Array.isArray(parsedOptions) ? parsedOptions : [];
      
      // Нормализуем варианты ответов к объектам {id, text}
      const normalizedOptions = optionsArray.map((opt: any, idx: number) => 
        typeof opt === 'string' ? { id: String(idx + 1), text: opt } : opt
      );

      // Перемешиваем варианты ответов на бэкенде
      const shuffledOptions = shuffle([...normalizedOptions]);

      return {
        ...q,
        options: shuffledOptions,
        correctOptionId: q.correct_option_id || q.correctOptionId || '',
      };
    });

    // 4. Создаем запись в БД с зафиксированным порядком ID
    const attempt = await prisma.attempt.create({
      data: {
        id: id || undefined,
        user_id: session?.user?.id || null,
        guest_id: session?.user?.id ? null : guestId || `guest_${Date.now()}`,
        quiz_id: quizId,
        score: 0,
        total_questions: questions.length,
        answers: [],
        question_order: shuffledIds, // Сохранили новый порядок в базу
        status: 'IN_PROGRESS',
        sync_status: 'synced',
      },
    });

    // 5. Отдаем готовые вопросы с зашафленными опциями и отключаем кэш
    return NextResponse.json({ 
      success: true, 
      attempt, 
      questions: questionsWithShuffledOptions 
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' }
    });
  } catch (error) {
    console.error('Start attempt error:', error);
    return NextResponse.json({ error: 'Failed to start attempt' }, { status: 500 });
  }
}
