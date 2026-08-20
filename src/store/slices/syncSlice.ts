import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export type PendingActionType = 'SAVE_ATTEMPT';

export interface PendingAction {
  id: string;
  type: PendingActionType;
  payload: Record<string, unknown>;
  createdAt: string;
}

interface SyncState {
  pendingActions: PendingAction[];
  syncStatus: 'idle' | 'syncing' | 'failed';
}

const initialState: SyncState = {
  pendingActions: [],
  syncStatus: 'idle',
};

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    addPendingAction(state, action: PayloadAction<PendingAction>) {
      state.pendingActions.push(action.payload);
    },
    removePendingAction(state, action: PayloadAction<string>) {
      state.pendingActions = state.pendingActions.filter(
        (item) => item.id !== action.payload
      );
    },
    clearQueue(state) {
      state.pendingActions = [];
    },
    setSyncStatus(state, action: PayloadAction<'idle' | 'syncing' | 'failed'>) {
      state.syncStatus = action.payload;
    },
  },
});

export const { addPendingAction, removePendingAction, clearQueue, setSyncStatus  } =
  syncSlice.actions;

const RETRY_DELAYS = [1000, 2000, 4000];
const MAX_RETRIES = 3;

async function tryFetch(url: string, options: RequestInit): Promise<Response> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      throw new Error('Bad response');
    } catch {
      if (attempt === MAX_RETRIES - 1) throw new Error('Все попытки провалились');
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]));
    }
  }
  throw new Error('Все попытки провалились');
}

export const processSyncQueue = createAsyncThunk(
  'sync/processQueue',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { pendingActions } = state.sync;

    if (pendingActions.length === 0) return;

    // Проверяем авторизацию
    try {
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      if (!session?.user) {
        return; // Не авторизован — не синхронизируем
      }
    } catch {
      return; // Даже сессию не можем проверить — нет сети
    }

    dispatch(setSyncStatus('syncing'));

    for (const action of pendingActions) {
      try {
        if (action.type === 'SAVE_ATTEMPT') {
          await tryFetch('/api/attempts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action.payload),
          });

          dispatch(removePendingAction(action.id));
        }
      } catch {
        dispatch(setSyncStatus('failed'));
        return;
      }
    }

    dispatch(setSyncStatus('idle'));
  }
);

export default syncSlice.reducer;
