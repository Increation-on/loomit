import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const quizApi = createApi({
  reducerPath: 'quizApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Quizzes', 'Quiz'], 
  endpoints: (builder) => ({
    getQuizzes: builder.query({
      query: () => '/quizzes',
      providesTags: ['Quizzes'],
      keepUnusedDataFor: 300,
    }),
    getQuizById: builder.query({
      query: (id: string) => `/quizzes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Quiz', id }], 
    }),
    updateQuiz: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/admin/quizzes/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Quizzes'],
    }),
  }),
});

export const { useGetQuizzesQuery, useGetQuizByIdQuery, useUpdateQuizMutation } = quizApi;