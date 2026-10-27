import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const quizApi = createApi({
  reducerPath: 'quizApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Quizzes', 'Quiz', 'Attempt'],
  endpoints: (builder) => ({
    // Для каталога
    getQuizzes: builder.query<any[], any>({
      query: () => '/quizzes',
      providesTags: ['Quizzes'],
      keepUnusedDataFor: 300,
    }),
    
    // Для админки (добавили)
    getAdminQuizzes: builder.query<any[], void>({
      query: () => '/admin/quizzes',
      providesTags: ['Quizzes'],
      keepUnusedDataFor: 0,
    }),

    getQuizById: builder.query({
      query: (id: string) => `/quizzes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Quiz', id }, 'Attempt'],
    }),
    updateQuiz: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/admin/quizzes/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Quizzes'],
    }),

    cancelAttempt: builder.mutation<void, string>({
      query: (attemptId) => ({
        url: `/attempts/${attemptId}`,
        method: 'PATCH',
        body: { forceComplete: true },
      }),
      invalidatesTags: ['Attempt', 'Quizzes'],
    }),
  }),
});

export const {
  useGetQuizzesQuery,
  useGetAdminQuizzesQuery, // <-- добавили
  useGetQuizByIdQuery,
  useUpdateQuizMutation,
  useCancelAttemptMutation,
} = quizApi;
