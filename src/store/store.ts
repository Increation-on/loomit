import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // сюда будем добавлять редюсеры позже
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;