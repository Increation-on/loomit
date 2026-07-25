import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Favorite {
  id: string;
  quiz: {
    id: string;
    title: string;
    description?: string | null;
    level: string;
    category: {
      id: string;
      name: string;
      iconUrl?: string | null;
    } | null;
    questions?: { id: string }[];
    _count?: {
      questions: number;
      attempts: number;
    };
  };
}

export const favoritesApi = createApi({
  reducerPath: 'favoritesApi',

  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),

  tagTypes: ['Favorites'],

  endpoints: (builder) => ({
    getFavorites: builder.query<Favorite[], void>({
      query: () => '/favorites',

      providesTags: ['Favorites'],
    }),

    toggleFavorite: builder.mutation<void, string>({
      query: (quizId) => ({
        url: '/favorites',
        method: 'POST',
        body: { quizId },
      }),

      invalidatesTags: ['Favorites'],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useToggleFavoriteMutation,
} = favoritesApi;