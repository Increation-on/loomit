import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Categories'],
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getCategories: builder.query<any[], void>({
      query: () => '/admin/categories',
      providesTags: ['Categories'],
    }),
    createCategory: builder.mutation({
      query: ({ name, iconUrl }: { name: string; iconUrl?: string | null }) => ({
        url: '/admin/categories',
        method: 'POST',
        body: { name, iconUrl },
      }),
      invalidatesTags: ['Categories'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, name, iconUrl }: { id: string; name: string; iconUrl?: string | null }) => ({
        url: '/admin/categories',
        method: 'PUT',
        body: { id, name, iconUrl },
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
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;