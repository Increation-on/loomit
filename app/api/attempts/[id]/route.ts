import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = 'nodejs';

// 1. ПОЛУЧЕНИЕ АКТИВНОЙ ПОПЫТКИ И ЕЕ ЗАШАФЛЕННЫХ ВОПРОСОВ
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: attemptId } = await params;

    // Ищем попытку и подтягиваем связанный квиз
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: { quiz: true }
    });

    if (!attempt || attempt.status === 'COMPLETED') {
      return NextResponse.json({ error: "Активная попытка не найдена" }, { status: 404 });
    }

    // Достаем ВСЕ вопросы этого квиза из базы
    const questions = await prisma.question.findMany({
      where: { quiz_id: attempt.quiz_id },
    });

    // Извлекаем сохраненный при старте порядок ID
    const orderIds = Array.isArray(attempt.question_order) 
      ? (attempt.question_order as string[]) 
      : [];

    // Сортируем вопросы строго по сохраненному серверному порядку question_order
    const orderedQuestions = orderIds
      .map((qId) => questions.find((q) => q.id === qId))
      .filter(Boolean);

    // Фолбэк на случай непредвиденных сбоев структуры
    const finalQuestions = orderedQuestions.length > 0 ? orderedQuestions : questions;

    // Безопасно маппим варианты ответов для фронтенда
       // Безопасно маппим варианты ответов для фронтенда
    const transformedQuestions = finalQuestions.map((q) => {
      // Так как q автоматически типизирован призмой, options имеет тип JsonValue.
      // Приводим его к unknown, а затем проверяем, строка это или массив
      const rawOptions = q.options as unknown;
      const parsedOptions = typeof rawOptions === 'string' ? JSON.parse(rawOptions) : rawOptions;
      const optionsArray = Array.isArray(parsedOptions) ? parsedOptions : [];
      
      const options = optionsArray.map((opt: unknown, idx: number) => 
        typeof opt === 'string' ? { id: String(idx + 1), text: opt } : (opt as { id: string; text: string })
      );

      return {
        id: q.id,
        text: q.text,
        options,
        correctOptionId: q.correct_option_id,
        explanation: q.explanation,
        order: q.order,
        quiz_id: q.quiz_id,
      };
    });


    const answersArray = Array.isArray(attempt.answers) ? attempt.answers : [];

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt.id,
        quizId: attempt.quiz_id,
        title: attempt.quiz.title,
        answers: answersArray,
        currentIndex: answersArray.length, // индекс — это количество отвеченных вопросов
        startedAt: attempt.created_at.toISOString(),
      },
      questions: transformedQuestions,
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' }
    });

  } catch (error) {
    console.error("Fetch active attempt error:", error);
    return NextResponse.json({ error: "Failed to fetch attempt" }, { status: 500 });
  }
}

// 2. СОХРАНЕНИЕ ШАГА КВИЗА
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
    } = body;

    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      return NextResponse.json({ error: "Попытка не найдена" }, { status: 404 });
    }

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
        status: isFinished ? "COMPLETED" : "IN_PROGRESS",
      },
    });

    return NextResponse.json({ success: true, attempt: updatedAttempt });
  } catch (error) {
    console.error("Save step attempt error:", error);
    return NextResponse.json({ error: "Failed to save answer" }, { status: 500 });
  }
}
