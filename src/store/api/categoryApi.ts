import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Categories'],
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/admin/categories',
      providesTags: ['Categories'],
    }),
    createCategory: builder.mutation({
      query: (name: string) => ({
        url: '/admin/categories',
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: ['Categories'],
    }),
    deleteCategory: builder.mutation({
      query: (id: string) => ({
        url: `/admin/categories?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
