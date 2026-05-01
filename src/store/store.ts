// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
<<<<<<< Updated upstream
=======
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { attemptsApi } from './api/attemptsApi';
import { quizApi } from './api/quizApi';
import quizReducer from './slices/quizSlice';
>>>>>>> Stashed changes

// Временный пустой редюсер
const emptyReducer = (state = {}) => state;

export const store = configureStore({
  reducer: {
<<<<<<< Updated upstream
    _empty: emptyReducer,
  },
=======
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
>>>>>>> Stashed changes
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;