// src/store/slices/headerSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type HeaderVariant = 'main' | 'tab' | 'nested' | 'hidden';

interface HeaderState {
  path: string | null;
  variant: HeaderVariant | null;
  title: string;
  showBack: boolean;
}

const initialState: HeaderState = {
  path: null,
  variant: null,
  title: '',
  showBack: false,
};

interface SetHeaderPayload {
  path: string;
  variant: HeaderVariant;
  title?: string;
  showBack?: boolean;
}

const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setHeader(state, action: PayloadAction<SetHeaderPayload>) {
      state.path = action.payload.path;
      state.variant = action.payload.variant;
      state.title = action.payload.title || '';
      state.showBack = action.payload.showBack || false;
    },
    resetHeader(state) {
      state.path = null;
      state.variant = null;
      state.title = '';
      state.showBack = false;
    },
  },
});

// Селекторы
export const selectHeaderState = (state: RootState) => state.header;
export const selectHeaderVariant = (state: RootState) => state.header.variant;
export const selectHeaderPath = (state: RootState) => state.header.path;

export const { setHeader, resetHeader } = headerSlice.actions;

export default headerSlice.reducer;
