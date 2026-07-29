// src/store/api/attemptsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface AttemptStatus {
  score: number;
  totalQuestions: number;
}

export const attemptsApi = createApi({
  reducerPath: 'attemptsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Attempts'],

  endpoints: (builder) => ({
    saveAttempt: builder.mutation({
      query: (attempt) => ({
        url: '/attempts',
        method: 'POST',
        body: attempt,
      }),
      invalidatesTags: ['Attempts'],
    }),

    getStatuses: builder.query<Record<string, AttemptStatus>, string[]>({
      query: (quizIds) => ({
        url: '/quizzes/status',
        method: 'POST',
        body: { quizIds },
      }),
      providesTags: ['Attempts'],
    }),
  }),
});

export const {
  useSaveAttemptMutation,
  useGetStatusesQuery,
} = attemptsApi;