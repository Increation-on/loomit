import quizReducer, {
  startQuiz,
  selectOption,
  confirmAnswer,
  nextQuestion,
  previousQuestion,
  finishQuiz,
  resetQuiz,
} from '../quizSlice';

const mockQuestions = [
  { id: 'q1', text: 'Вопрос 1', options: ['A', 'B', 'C', 'D'], correctOptionId: 'B' },
  { id: 'q2', text: 'Вопрос 2', options: ['X', 'Y', 'Z', 'W'], correctOptionId: 'Z' },
];

const mockQuiz = { id: 'quiz1', title: 'Тестовый квиз' };

describe('quizSlice', () => {
  it('startQuiz инициализирует состояние', () => {
    const state = quizReducer(undefined, startQuiz({ quiz: mockQuiz, questions: mockQuestions }));
    expect(state.currentQuiz).toEqual(mockQuiz);
    expect(state.questions).toHaveLength(2);
    expect(state.currentIndex).toBe(0);
    expect(state.isFinished).toBe(false);
    expect(state.answers).toEqual([]);
  });

  it('answerQuestion сохраняет ответ и считает isCorrect', () => {
    let state = quizReducer(undefined, startQuiz({ quiz: mockQuiz, questions: mockQuestions }));
    state = quizReducer(state, selectOption('B'));
    state = quizReducer(state, confirmAnswer());
    expect(state.answers).toHaveLength(1);
    expect(state.answers[0].isCorrect).toBe(true);
    expect(state.answers[0].selectedOptionId).toBe('B');
  });

  it('nextQuestion и previousQuestion меняют индекс', () => {
    let state = quizReducer(undefined, startQuiz({ quiz: mockQuiz, questions: mockQuestions }));
    state = quizReducer(state, nextQuestion());
    expect(state.currentIndex).toBe(1);
    state = quizReducer(state, previousQuestion());
    expect(state.currentIndex).toBe(0);
  });

  it('finishQuiz ставит isFinished: true', () => {
    let state = quizReducer(undefined, startQuiz({ quiz: mockQuiz, questions: mockQuestions }));
    state = quizReducer(state, finishQuiz());
    expect(state.isFinished).toBe(true);
  });

  it('resetQuiz сбрасывает состояние', () => {
    let state = quizReducer(undefined, startQuiz({ quiz: mockQuiz, questions: mockQuestions }));
    state = quizReducer(state, resetQuiz());
    expect(state.currentQuiz).toBeNull();
    expect(state.questions).toEqual([]);
    expect(state.isFinished).toBe(false);
  });
});