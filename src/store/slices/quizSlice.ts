import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

interface QuizState {
  currentQuiz: { id: string; title: string } | null;
  questions: { id: string; text: string; options: string[]; correctOptionId: string }[];
  answers: UserAnswer[];
  currentIndex: number;
  isFinished: boolean;
}

const initialState: QuizState = {
  currentQuiz: null,
  questions: [],
  answers: [],
  currentIndex: 0,
  isFinished: false,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz(state, action: PayloadAction<{ quiz: { id: string; title: string }; questions: any[] }>) {
      state.currentQuiz = action.payload.quiz;
      state.questions = action.payload.questions;
      state.answers = [];
      state.currentIndex = 0;
      state.isFinished = false;
    },
    answerQuestion(state, action: PayloadAction<{ questionId: string; selectedOptionId: string }>) {
      const question = state.questions.find(q => q.id === action.payload.questionId);
      const isCorrect = question?.correctOptionId === action.payload.selectedOptionId;
      const existing = state.answers.find(a => a.questionId === action.payload.questionId);
      if (existing) {
        existing.selectedOptionId = action.payload.selectedOptionId;
        existing.isCorrect = isCorrect;
      } else {
        state.answers.push({ ...action.payload, isCorrect });
      }
    },
    nextQuestion(state) {
      if (state.currentIndex < state.questions.length - 1) state.currentIndex++;
    },
    previousQuestion(state) {
      if (state.currentIndex > 0) state.currentIndex--;
    },
    finishQuiz(state) {
      state.isFinished = true;
    },
    resetQuiz(state) {
      return initialState;
    },
  },
});

export const { startQuiz, answerQuestion, nextQuestion, previousQuestion, finishQuiz, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;