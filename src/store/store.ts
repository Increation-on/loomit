import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { attemptsApi } from './api/attemptsApi';
import { quizApi } from './api/quizApi';
import quizReducer from './slices/quizSlice';

const persistConfig = {
  key: 'quiz',
  storage,
  whitelist: ['questions', 'answers', 'currentIndex', 'isFinished', 'startedAt', 'currentQuiz'],
};

const persistedQuizReducer = persistReducer(persistConfig, quizReducer);

export const store = configureStore({
  reducer: {
    quiz: persistedQuizReducer,
    [attemptsApi.reducerPath]: attemptsApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(attemptsApi.middleware)
      .concat(quizApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;