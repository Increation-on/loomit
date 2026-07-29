// 'use client';

// import { useMemo, useCallback, useState } from 'react';
// import { useSession } from 'next-auth/react';
// import {
//     useGetFavoritesQuery,
//     useToggleFavoriteMutation,
// } from '@/store/api/favoritesApi';

// export function useFavorites() {
//     const { data: session, status } = useSession();

//     console.log('🟢 [useFavorites] сессия:', session?.user?.id ? 'есть' : 'нет');

//     const query = useGetFavoritesQuery(undefined, {
//         skip: !session,
//     });

//     console.log('📦 [useFavorites] query status:', query.status, 'isLoading:', query.isLoading, 'isFetching:', query.isFetching);

//     const {
//         data: favorites = [],
//         isLoading: isListLoading,
//         isFetching,
//     } = query;

//     console.log('📋 [useFavorites] favorites получены:', favorites.length, 'шт');

//     const [toggleFavorite, { isLoading: isToggling }] =
//         useToggleFavoriteMutation();

//     // ✅ Локальный оптимистичный стейт
//     const [optimisticIds, setOptimisticIds] = useState<Set<string>>(new Set());

//     console.log('🧠 [useFavorites] optimisticIds размер:', optimisticIds.size);

//     // ✅ Объединяем реальные + оптимистичные ID
//     const favoriteIds = useMemo(() => {
//         const realIds = new Set(favorites.map((fav) => fav.quiz.id));
//         const combined = new Set([...realIds, ...optimisticIds]);
//         console.log('🔄 [useFavorites] favoriteIds пересчитан:', {
//             real: realIds.size,
//             optimistic: optimisticIds.size,
//             combined: combined.size,
//         });
//         return combined;
//     }, [favorites, optimisticIds]);

//     const isFavorite = useCallback(
//         (quizId: string) => {
//             const result = favoriteIds.has(quizId);
//             console.log(`🔍 [useFavorites] isFavorite(${quizId}) = ${result}`);
//             return result;
//         },
//         [favoriteIds]
//     );

//     const toggle = useCallback(async (quizId: string) => {
//         if (!session) return;

//         const wasFavorite = favoriteIds.has(quizId); // ✅ вычисляем до изменения

//         setOptimisticIds((prev) => {
//             const newSet = new Set(prev);
//             if (wasFavorite) {
//                 newSet.delete(quizId);
//             } else {
//                 newSet.add(quizId);
//             }
//             return newSet;
//         });

//         try {
//             await toggleFavorite(quizId).unwrap();
//             setOptimisticIds((prev) => {
//                 const newSet = new Set(prev);
//                 newSet.delete(quizId);
//                 return newSet;
//             });
//         } catch (err) {
//             console.error(err);
//         }
//     }, [session, toggleFavorite, favoriteIds]);

//     console.log('🏁 [useFavorites] возвращаем хук. isLoading:', isListLoading || isFetching, 'isToggling:', isToggling);

//     return {
//         favorites,
//         favoriteIds,
//         isFavorite,
//         toggle,

//         isLoading: isListLoading,
//         isFetching,
//         isToggling,

//         isAuthenticated: !!session,
//         status,
//     };
// }