'use client';

import { useState, useCallback } from 'react';

export function useSaveAttempt(quizId: string) {
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Функция для создания новой попытки в БД (вызывается при старте квиза)
  const startNewAttempt = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId }),
      });
      const data = await response.json();
      
      if (data.success && data.attempt) {
        setAttemptId(data.attempt.id);
        return data; // Возвращаем данные попытки и зашафленные вопросы
      }
      throw new Error(data.error || 'Failed to start attempt');
    } catch (error) {
      console.error('Ошибка при инициализации попытки в БД:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [quizId]);

  // 2. Функция для сохранения ОДНОГО ответа (вызывается при клике на "Подтвердить")
  const saveStep = useCallback(async (
    currentAttemptId: string, 
    answerData: {
      questionId: string;
      selectedOptionId: string;
      isCorrect: boolean;
      questionText: string;
      correctOptionId: string;
    }
  ) => {
    if (!currentAttemptId) return;
    
    try {
      const response = await fetch(`/api/attempts/${currentAttemptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answerData),
      });
      return await response.json();
    } catch (error) {
      console.error('Ошибка при сохранении шага квиза в БД:', error);
    }
  }, []);

  return { 
    attemptId, 
    setAttemptId, // Понадобится при возобновлении сессии
    startNewAttempt, 
    saveStep,
    isLoading 
  };
}
