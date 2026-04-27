// src/store/api/attemptsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const attemptsApi = createApi({
  reducerPath: 'attemptsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    saveAttempt: builder.mutation({
      query: (attempt) => ({
        url: '/attempts',
        method: 'POST',
        body: attempt,
      }),
    }),
  }),
});

export const { useSaveAttemptMutation } = attemptsApi;