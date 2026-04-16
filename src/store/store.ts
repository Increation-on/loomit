// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';

// Временный пустой редюсер
const emptyReducer = (state = {}) => state;

export const store = configureStore({
  reducer: {
    _empty: emptyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;