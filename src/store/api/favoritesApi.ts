import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const favoritesApi = createApi({
  reducerPath: 'favoritesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Favorites'],
  endpoints: (builder) => ({
    // Получить список избранного
    getFavorites: builder.query({
      query: () => '/favorites',
      providesTags: ['Favorites'],
    }),

    // Добавить или удалить из избранного (toggle)
    toggleFavorite: builder.mutation({
      query: (quizId: string) => ({
        url: '/favorites',
        method: 'POST',
        body: { quizId },
      }),
      invalidatesTags: ['Favorites'], // ✅ Просто инвалидируем кэш
    }),

    // Проверить, добавлен ли квиз в избранное
    checkFavorite: builder.query({
      query: (quizId: string) => `/favorites/check?quizId=${quizId}`,
      providesTags: (result, error, quizId) => [{ type: 'Favorites', id: quizId }],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useToggleFavoriteMutation,
  useCheckFavoriteQuery,
} = favoritesApi;