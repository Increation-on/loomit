import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  questionText: string;
  correctOptionId: string;
}

interface QuizState {
  currentQuiz: { id: string; title: string } | null;
  questions: {
    id: string;
    text: string;
    options: {
      id: string;
      text: string;
    }[];
    correctOptionId: string;
    explanation?: string;
  }[];
  answers: UserAnswer[];
  currentIndex: number;
  selectedOption: string | null;
  isFinished: boolean;
  startedAt: string | null;
  attemptId: string | null;
}

const initialState: QuizState = {
  currentQuiz: null,
  questions: [],
  answers: [],
  currentIndex: 0,
  selectedOption: null,
  isFinished: false,
  startedAt: null,
  attemptId: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz(
      state,
      action: PayloadAction<{
        quiz: { id: string; title: string };
        questions: any[];
        attemptId?: string | null;
      }>
    ) {
      state.currentQuiz = action.payload.quiz;
      state.attemptId = action.payload.attemptId || null;

      state.questions = (action.payload.questions || []).map((q: any) => {
        // ✅ Нормализуем options (если строка — парсим, если массив — оставляем)
        let options = q.options;
        if (typeof options === 'string') {
          try {
            options = JSON.parse(options);
          } catch (e) {
            options = [];
          }
        }
        if (!Array.isArray(options)) {
          options = [];
        }

        return {
          id: q.id,
          text: q.text,
          options: options.map((opt: any, idx: number) =>
            typeof opt === 'string' ? { id: String(idx + 1), text: opt } : opt
          ),
          correctOptionId: q.correct_option_id || q.correctOptionId || '',
          explanation: q.explanation || '',
        };
      });

      state.answers = [];
      state.currentIndex = 0;
      state.selectedOption = null;
      state.isFinished = false;
      state.startedAt = new Date().toISOString();
    },

    resumeQuizFromServer(
      state,
      action: PayloadAction<{
        quiz: { id: string; title: string };
        questions: any[];
        answers: UserAnswer[];
        currentIndex: number;
        attemptId: string;
        startedAt: string;
      }>
    ) {
      state.currentQuiz = action.payload.quiz;
      state.attemptId = action.payload.attemptId;
      state.answers = action.payload.answers || [];

      // Вопросы восстанавливаются строго в сохраненном порядке
      state.questions = (action.payload.questions || []).map((q: any) => ({
        id: q.id,
        text: q.text,
        options: q.options || [],
        correctOptionId: q.correctOptionId || q.correct_option_id || '',
        explanation: q.explanation || '',
      }));

      const targetIndex = action.payload.currentIndex;
      state.currentIndex =
        targetIndex < state.questions.length ? targetIndex : state.questions.length - 1;

      const currentQuestionId = state.questions[state.currentIndex]?.id;
      const existingAnswer = state.answers.find((a) => a.questionId === currentQuestionId);
      state.selectedOption = existingAnswer?.selectedOptionId || null;

      state.isFinished = false;
      state.startedAt = action.payload.startedAt;
    },

    selectOption(state, action: PayloadAction<string>) {
      state.selectedOption = action.payload;
    },
    confirmAnswer(state) {
      const question = state.questions[state.currentIndex];
      const selectedOption = state.selectedOption;
      if (!question || !selectedOption) return;

      const isCorrect = question.correctOptionId === selectedOption;
      const existing = state.answers.find((a) => a.questionId === question.id);
      if (existing) {
        existing.selectedOptionId = selectedOption;
        existing.isCorrect = isCorrect;
        existing.questionText = question.text;
        existing.correctOptionId = question.correctOptionId;
      } else {
        state.answers.push({
          questionId: question.id,
          selectedOptionId: selectedOption,
          isCorrect,
          questionText: question.text,
          correctOptionId: question.correctOptionId,
        });
      }
    },
    nextQuestion(state) {
      if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex++;
        state.selectedOption = null;
      }
    },
    previousQuestion(state) {
      if (state.currentIndex > 0) {
        state.currentIndex--;
        const prevAnswer = state.answers.find(
          (a) => a.questionId === state.questions[state.currentIndex]?.id
        );
        state.selectedOption = prevAnswer?.selectedOptionId || null;
      }
    },
    finishQuiz(state) {
      state.isFinished = true;
    },
    goToQuestion(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index >= 0 && index < state.questions.length) {
        state.currentIndex = index;
        const answer = state.answers.find((a) => a.questionId === state.questions[index]?.id);
        state.selectedOption = answer?.selectedOptionId || null;
      }
    },
    resetQuiz(state) {
      return initialState;
    },
  },
});

// Селекторы
export const selectQuizState = (state: RootState) => state.quiz;

export const selectCurrentQuestion = (state: RootState) => {
  const { questions, currentIndex } = state.quiz;
  return questions[currentIndex];
};

export const selectScore = (state: RootState) => {
  const { answers } = state.quiz;
  return answers.filter((a) => a.isCorrect).length;
};

export const selectProgress = (state: RootState) => {
  const { currentIndex, questions } = state.quiz;
  return questions.length > 0 ? (currentIndex + 1) / questions.length : 0;
};

export const selectIsConfirmed = (state: RootState) => {
  const { answers, questions, currentIndex } = state.quiz;
  const currentQuestion = questions[currentIndex];
  return !!answers.find((a) => a.questionId === currentQuestion?.id);
};

export const selectSelectedOption = (state: RootState) => state.quiz.selectedOption;

export const {
  startQuiz,
  resumeQuizFromServer,
  selectOption,
  confirmAnswer,
  nextQuestion,
  previousQuestion,
  finishQuiz,
  resetQuiz,
  goToQuestion,
} = quizSlice.actions;

export default quizSlice.reducer;
