import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { attemptsApi } from './api/attemptsApi';
import { quizApi } from './api/quizApi';
import { categoryApi } from './api/categoryApi';
import { favoritesApi } from './api/favoritesApi';
import quizReducer from './slices/quizSlice';
import syncReducer from './slices/syncSlice';
import idbStorage from '@/lib/idbStorage';
import { useDispatch } from 'react-redux';
import { offlineMiddleware } from './middleware/offlineMiddleware';
import { profileApi } from './api/profileApi';


const quizPersistConfig = {
  key: 'quiz',
  storage: idbStorage,
  whitelist: ['questions', 'answers', 'currentIndex', 'isFinished', 'startedAt', 'currentQuiz'],
};

const syncPersistConfig = {
  key: 'sync',
  storage: idbStorage,
  whitelist: ['pendingActions'],
};

const persistedQuizReducer = persistReducer(quizPersistConfig, quizReducer);
const persistedSyncReducer = persistReducer(syncPersistConfig, syncReducer);

export const store = configureStore({
  reducer: {
    quiz: persistedQuizReducer,
    sync: persistedSyncReducer,
    [attemptsApi.reducerPath]: attemptsApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
    [categoryApi.reducerPath] : categoryApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(attemptsApi.middleware)
      .concat(quizApi.middleware)
      .concat(offlineMiddleware)
      .concat(profileApi.middleware)
      .concat(categoryApi.middleware)
      .concat(favoritesApi.middleware)
});

export const persistor = persistStore(store);
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
