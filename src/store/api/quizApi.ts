import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const quizApi = createApi({
  reducerPath: 'quizApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  // Добавляем тег 'Attempt' для сквозной синхронизации сессий
  tagTypes: ['Quizzes', 'Quiz', 'Attempt'], 
  endpoints: (builder) => ({
    getQuizzes: builder.query<any[], any>({
      query: () => '/quizzes',
      providesTags: ['Quizzes'],
      keepUnusedDataFor: 300,
    }),
    getQuizById: builder.query({
      query: (id: string) => `/quizzes/${id}`,
      // Хук подписывается и на сам квиз, и на статус попытки
      providesTags: (result, error, id) => [
        { type: 'Quiz', id },
        'Attempt'
      ], 
    }),
    updateQuiz: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/admin/quizzes/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Quizzes'],
    }),

    // Мутация отмены
    cancelAttempt: builder.mutation<void, string>({
      query: (attemptId) => ({
        url: `/attempts/${attemptId}`,
        method: 'PATCH',
        body: { forceComplete: true },
      }),
      // Инвалидируем 'Attempt' — это заставит все хукиuseGetQuizByIdQuery мгновенно сделать refetch
      invalidatesTags: ['Attempt', 'Quizzes'],
    }),
  }),
});

export const { 
  useGetQuizzesQuery, 
  useGetQuizByIdQuery, 
  useUpdateQuizMutation,
  useCancelAttemptMutation 
} = quizApi;
