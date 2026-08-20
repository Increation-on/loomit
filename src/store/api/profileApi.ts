import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const profileApi = createApi({
    reducerPath: 'profileApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        getStats: builder.query({
            query: () => '/profile/stats',
        }),
        getAttempts: builder.query({
            query: () => '/profile/attempts',
        }),
        getAttemptById: builder.query({
            query: (id: string) => `/profile/attempts/${id}`,
        }),
        getAllAttempts: builder.query({
            query: (page: number) => `/profile/attempts?page=${page}&limit=20`,
        }),
    }),
});

export const {
    useGetStatsQuery,
    useGetAttemptsQuery,
    useGetAttemptByIdQuery,
    useGetAllAttemptsQuery
} = profileApi;
