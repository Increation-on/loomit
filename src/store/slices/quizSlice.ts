import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { shuffle } from '@/lib/utils';

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
    explanation?: string; // ✅ добавляем
  }[];
  answers: UserAnswer[];
  currentIndex: number;
  selectedOption: string | null;
  isFinished: boolean;
  startedAt: string | null;
}

const initialState: QuizState = {
  currentQuiz: null,
  questions: [],
  answers: [],
  currentIndex: 0,
  selectedOption: null,
  isFinished: false,
  startedAt: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz(state, action: PayloadAction<{ quiz: { id: string; title: string }; questions: any[] }>) {
  state.currentQuiz = action.payload.quiz;
  
  // Перемешиваем вопросы
  const shuffledQuestions = shuffle(action.payload.questions);
  
  state.questions = shuffledQuestions.map((q: any) => ({
    id: q.id,
    text: q.text,
    // Перемешиваем варианты внутри вопроса
    options: shuffle(q.options.map((o: any) => 
      typeof o === 'string' ? { id: crypto.randomUUID(), text: o } : o
    )),
    correctOptionId: q.correct_option_id || q.correctOptionId || '',
    explanation: q.explanation || '',
  }));
  
  state.answers = [];
  state.currentIndex = 0;
  state.selectedOption = null;
  state.isFinished = false;
  state.startedAt = new Date().toISOString();
},
    selectOption(state, action: PayloadAction<string>) {
      state.selectedOption = action.payload;
    },
    confirmAnswer(state) {
      const question = state.questions[state.currentIndex];
      const selectedOption = state.selectedOption;
      if (!question || !selectedOption) return;

      const isCorrect = question.correctOptionId === selectedOption;
      const existing = state.answers.find(a => a.questionId === question.id);
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
        const prevAnswer = state.answers.find(a => a.questionId === state.questions[state.currentIndex]?.id);
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
        const answer = state.answers.find(a => a.questionId === state.questions[index]?.id);
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
  return answers.filter(a => a.isCorrect).length;
};

export const selectProgress = (state: RootState) => {
  const { currentIndex, questions } = state.quiz;
  return (currentIndex + 1) / questions.length;
};

export const selectIsConfirmed = (state: RootState) => {
  const { answers, questions, currentIndex } = state.quiz;
  const currentQuestion = questions[currentIndex];
  return !!answers.find(a => a.questionId === currentQuestion?.id);
};

export const selectSelectedOption = (state: RootState) => state.quiz.selectedOption;

export const { startQuiz, selectOption, confirmAnswer, nextQuestion, previousQuestion, finishQuiz, resetQuiz, goToQuestion } = quizSlice.actions;
export default quizSlice.reducer;
