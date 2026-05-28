import syncReducer, {
  addPendingAction,
  removePendingAction,
  clearQueue,
  setSyncStatus,
} from '../syncSlice';
import type { PendingAction } from '../syncSlice';

const mockAction: PendingAction = {
  id: '1',
  type: 'SAVE_ATTEMPT',
  payload: { quizId: 'q1' },
  createdAt: new Date().toISOString(),
};

describe('syncSlice', () => {
  it('addPendingAction добавляет в очередь', () => {
    const state = syncReducer(undefined, addPendingAction(mockAction));
    expect(state.pendingActions).toHaveLength(1);
    expect(state.pendingActions[0]).toEqual(mockAction);
  });

  it('removePendingAction удаляет из очереди', () => {
    let state = syncReducer(undefined, addPendingAction(mockAction));
    state = syncReducer(state, removePendingAction('1'));
    expect(state.pendingActions).toHaveLength(0);
  });

  it('clearQueue очищает очередь', () => {
    let state = syncReducer(undefined, addPendingAction(mockAction));
    state = syncReducer(state, clearQueue());
    expect(state.pendingActions).toHaveLength(0);
  });

  it('setSyncStatus меняет статус', () => {
    const state = syncReducer(undefined, setSyncStatus('syncing'));
    expect(state.syncStatus).toBe('syncing');
  });
});