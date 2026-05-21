import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const quizApi = createApi({
  reducerPath: 'quizApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Quizzes'],
  endpoints: (builder) => ({
    getQuizzes: builder.query({
      query: () => '/quizzes',
      providesTags: ['Quizzes'],
      keepUnusedDataFor: 300,
    }),
    getQuizById: builder.query({
      query: (id: string) => `/quizzes/${id}`,
    }),
  }),
});

export const { useGetQuizzesQuery, useGetQuizByIdQuery } = quizApi;