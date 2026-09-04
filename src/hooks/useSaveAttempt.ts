'use client';

import { useState, useCallback } from 'react';

export function useSaveAttempt(quizId: string) {
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const saveStep = useCallback(
    async (
      currentAttemptId: string | null,
      answerData: {
        quizId: string;
        questionId: string;
        selectedOptionId: string;
        isCorrect: boolean;
        questionText: string;
        correctOptionId: string;
        questionOrder?: string[]; // ← добавлено
      }
    ) => {
      setIsLoading(true);

      try {
        const method = currentAttemptId ? 'PATCH' : 'POST';
        const url = currentAttemptId
          ? `/api/attempts/${currentAttemptId}`
          : '/api/attempts';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(answerData),
        });

        if (response.status === 204) {
          return { success: true };
        }

        const text = await response.text();
        if (!text) {
          return { success: true };
        }

        const data = JSON.parse(text);

        if (data.created && data.attempt?.id) {
          setAttemptId(data.attempt.id);
        }

        return data;
      } catch (error) {
        console.error('❌ Ошибка при сохранении шага квиза:', error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const forceComplete = useCallback(async (currentAttemptId: string) => {
    if (!currentAttemptId) return;

    try {
      const response = await fetch(`/api/attempts/${currentAttemptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceComplete: true }),
      });

      if (response.status === 204) {
        return { success: true };
      }

      const text = await response.text();
      if (!text) {
        return { success: true };
      }

      return JSON.parse(text);
    } catch (error) {
      console.error('❌ Ошибка при завершении попытки:', error);
      return null;
    }
  }, []);

  return {
    attemptId,
    setAttemptId,
    saveStep,
    forceComplete,
    isLoading,
  };
}