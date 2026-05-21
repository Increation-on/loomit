import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { addPendingAction } from '../slices/syncSlice';

export const offlineMiddleware: Middleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const error = action.payload as { status?: string; error?: string };
    const meta = action.meta as { arg?: { endpointName?: string; originalArgs?: unknown } };

    const isNetworkError =
      error?.status === 'FETCH_ERROR' ||
      error?.error === 'TypeError: fetch failed' ||
      error?.error === 'TypeError: NetworkError when attempting to fetch resource.' ||
      error?.error?.includes('ERR_NETWORK') ||
      error?.error?.includes('fetch failed');

    if (isNetworkError && meta?.arg?.endpointName === 'saveAttempt') {
      store.dispatch(
        addPendingAction({
          id: crypto.randomUUID(),
          type: 'SAVE_ATTEMPT',
          payload: meta.arg?.originalArgs as Record<string, unknown>,
          createdAt: new Date().toISOString(),
        })
      );
    }
  }

  return next(action);
};