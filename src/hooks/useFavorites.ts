'use client';

import { useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';

import {
    useGetFavoritesQuery,
    useToggleFavoriteMutation,
} from '@/store/api/favoritesApi';

export function useFavorites() {
    const { data: session, status } = useSession();

   const query = useGetFavoritesQuery(undefined, {
    skip: !session,
});

console.log('[useFavorites query]', query);

const {
    data: favorites = [],
    isLoading,
    isFetching,
} = query;

console.log('[useFavorites]', {
    favorites: favorites.length,
    isLoading,
    isFetching,
});

    const [toggleFavorite, { isLoading: isToggling }] =
        useToggleFavoriteMutation();

    const favoriteIds = useMemo(
        () => new Set(favorites.map((fav) => fav.quiz.id)),
        [favorites]
    );

    const isFavorite = useCallback(
        (quizId: string) => favoriteIds.has(quizId),
        [favoriteIds]
    );

    const toggle = useCallback(async (quizId: string) => {
    console.log('[toggle start]', quizId);

    if (!session) return;

    try {
        await toggleFavorite(quizId).unwrap();
        console.log('[toggle success]');
    } catch (err) {
        console.error(err);
    }
}, [session, toggleFavorite]);

    return {
        favorites,
        favoriteIds,
        isFavorite,
        toggle,
        isLoading: isLoading || isFetching || isToggling,
        isAuthenticated: !!session,
        status,
    };
}