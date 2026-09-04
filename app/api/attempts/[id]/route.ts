// src/app/api/attempts/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { prisma } from '@/lib/prisma';
import { shuffle } from '@/lib/utils';
import { authOptions } from '../../auth/[...nextauth]/route';

export const runtime = 'nodejs';

// 🔹 ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: создание попытки с первым ответом
async function createAttemptWithFirstAnswer({
  userId,
  guestId,
  quizId,
  questionId,
  selectedOptionId,
  isCorrect,
  questionText,
  correctOptionId,
}: any) {
  // 1. Получаем все вопросы квиза
  const questions = await prisma.question.findMany({
    where: { quiz_id: quizId },
  });

  if (questions.length === 0) {
    throw new Error('Вопросы для квиза не найдены');
  }

  // 2. Шафлим вопросы
  const shuffledQuestions = shuffle([...questions]);
  const shuffledIds = shuffledQuestions.map((q) => q.id);

  // 3. Шафлим варианты для каждого вопроса
  const questionsWithShuffledOptions = shuffledQuestions.map((q) => {
    const parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
    const optionsArray = Array.isArray(parsedOptions) ? parsedOptions : [];
    const normalizedOptions = optionsArray.map((opt: any, idx: number) =>
      typeof opt === 'string' ? { id: String(idx + 1), text: opt } : opt
    );
    const shuffledOptions = shuffle([...normalizedOptions]);
    return {
      ...q,
      options: shuffledOptions,
      correctOptionId: q.correct_option_id || '',
    };
  });

  // 4. Создаём попытку
  const attempt = await prisma.attempt.create({
    data: {
      user_id: userId || null,
      guest_id: userId ? null : guestId || `guest_${Date.now()}`,
      quiz_id: quizId,
      score: isCorrect ? 1 : 0,
      total_questions: questions.length,
      answers: [
        {
          questionId,
          selectedOptionId,
          isCorrect,
          questionText,
          correctOptionId,
        },
      ],
      question_order: shuffledIds,
      status: 'IN_PROGRESS',
      sync_status: 'synced',
    },
  });

  return { attempt, questions: questionsWithShuffledOptions };
}

// ============================================================
// 1. GET — восстановление сессии
// ============================================================
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: attemptId } = await params;

    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: { quiz: true },
    });

    if (!attempt || attempt.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Активная попытка не найдена' }, { status: 404 });
    }

    const questions = await prisma.question.findMany({
      where: { quiz_id: attempt.quiz_id },
    });

    const orderIds = Array.isArray(attempt.question_order)
      ? (attempt.question_order as string[])
      : [];

    const orderedQuestions = orderIds
      .map((qId) => questions.find((q) => q.id === qId))
      .filter(Boolean);

    const finalQuestions = orderedQuestions.length > 0 ? orderedQuestions : questions;

    const transformedQuestions = finalQuestions.map((q: any) => {
      const parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
      const optionsArray = Array.isArray(parsedOptions) ? parsedOptions : [];
      const options = optionsArray.map((opt: any, idx: number) =>
        typeof opt === 'string' ? { id: String(idx + 1), text: opt } : opt
      );
      return {
        ...q,
        options,
        correctOptionId: q.correct_option_id || q.correctOptionId || '',
      };
    });

    const answersArray = Array.isArray(attempt.answers) ? attempt.answers : [];

    return NextResponse.json(
      {
        success: true,
        attempt: {
          id: attempt.id,
          quizId: attempt.quiz_id,
          title: attempt.quiz.title,
          answers: answersArray,
          currentIndex: answersArray.length > 0 ? answersArray.length : 0,
          startedAt: attempt.created_at.toISOString(),
        },
        questions: transformedQuestions,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('❌ Fetch active attempt error:', error);
    return NextResponse.json({ error: 'Failed to fetch attempt' }, { status: 500 });
  }
}

// ============================================================
// 2. PATCH — сохранение ответа (или создание + сохранение)
// ============================================================
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: attemptId } = await params;
    const body = await request.json();

    const {
      questionId,
      selectedOptionId,
      isCorrect,
      questionText,
      correctOptionId,
      forceComplete,
      quizId, // ← добавляем quizId для создания
    } = body;

    // ============================================================
    // СЦЕНАРИЙ А: Принудительный сброс черновика
    // ============================================================
    if (forceComplete) {
      const updatedAttempt = await prisma.attempt.update({
        where: { id: attemptId },
        data: { status: 'COMPLETED' },
      });
      return NextResponse.json({ success: true, attempt: updatedAttempt });
    }

    // ============================================================
    // СЦЕНАРИЙ Б: Проверяем, существует ли попытка
    // ============================================================
    let attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
    });

    // ============================================================
    // Если попытки нет — создаём с первым ответом
    // ============================================================
    if (!attempt) {
      if (!quizId || !questionId || !selectedOptionId) {
        return NextResponse.json(
          { error: 'Не хватает данных для создания попытки' },
          { status: 400 }
        );
      }

      const session = await getServerSession(authOptions);
      const userId = session?.user?.id;

      const result = await createAttemptWithFirstAnswer({
        userId,
        guestId: userId ? null : `guest_${Date.now()}`,
        quizId,
        questionId,
        selectedOptionId,
        isCorrect,
        questionText,
        correctOptionId,
      });

      attempt = result.attempt;

      // Возвращаем созданную попытку + зашафленные вопросы
      return NextResponse.json({
        success: true,
        attempt: {
          id: attempt.id,
          quizId: attempt.quiz_id,
          title: '',
          answers: attempt.answers,
          currentIndex: (attempt.answers as any[]).length,
          startedAt: attempt.created_at.toISOString(),
        },
        questions: result.questions,
        created: true, // флаг, что попытка создана
      });
    }

    // ============================================================
    // СЦЕНАРИЙ В: Попытка существует — обновляем
    // ============================================================
    const currentAnswers = (attempt.answers as any[]) || [];
    const existingAnswerIndex = currentAnswers.findIndex((a) => a.questionId === questionId);

    const newAnswer = {
      questionId,
      selectedOptionId,
      isCorrect,
      questionText,
      correctOptionId,
    };

    if (existingAnswerIndex !== -1) {
      currentAnswers[existingAnswerIndex] = newAnswer;
    } else {
      currentAnswers.push(newAnswer);
    }

    const newScore = currentAnswers.filter((a) => a.isCorrect).length;
    const isFinished = currentAnswers.length === attempt.total_questions;

    const updatedAttempt = await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        answers: currentAnswers,
        score: newScore,
        status: isFinished ? 'COMPLETED' : 'IN_PROGRESS',
      },
    });

    return NextResponse.json({ success: true, attempt: updatedAttempt, created: false });
  } catch (error) {
    console.error('❌ Save step attempt error:', error);
    return NextResponse.json({ error: 'Failed to save answer' }, { status: 500 });
  }
}