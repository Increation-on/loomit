'use client';

import { useRef, useState, useCallback } from 'react';
import { useSaveAttemptMutation } from '@/store/api/attemptsApi';

export function useSaveAttempt(quizId: string) {
  const [saveAttempt] = useSaveAttemptMutation();
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const savedRef = useRef(false);

  const save = useCallback(
    (answers: any[], score: number, totalQuestions: number) => {
      if (savedRef.current) return;
      savedRef.current = true;

      const localAttemptId = crypto.randomUUID();
      setAttemptId(localAttemptId);

      return saveAttempt({
        id: localAttemptId,
        quizId,
        score,
        totalQuestions,
        answers,
      });
    },
    [quizId, saveAttempt]
  );

  return { attemptId, save };
}