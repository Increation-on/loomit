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

    questions?: {
      id: string;
    }[];

    _count?: {
      questions: number;
      attempts: number;
    };
  };
}


interface ToggleFavoriteArgs {
  quizId: string;
  quiz: Favorite['quiz'];
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



    toggleFavorite: builder.mutation<
      { favorited: boolean },
      ToggleFavoriteArgs
    >({

      query: ({ quizId }) => ({
        url: '/favorites',
        method: 'POST',
        body: {
          quizId,
        },
      }),



      async onQueryStarted(
        { quizId, quiz },
        { dispatch, queryFulfilled }
      ) {


        const patchResult =
          dispatch(
            favoritesApi.util.updateQueryData(
              'getFavorites',
              undefined,
              (draft) => {


                const index =
                  draft.findIndex(
                    (fav) =>
                      fav.quiz.id === quizId
                  );



                // уже есть → удаляем
                if (index !== -1) {

                  draft.splice(index, 1);

                  return;
                }



                // нет → добавляем
                draft.unshift({

                  id: `temp-${quizId}`,

                  quiz,

                });

              }
            )
          );



        try {

          await queryFulfilled;


        } catch {

          patchResult.undo();

        }

      },

    }),

  }),
});



export const {
  useGetFavoritesQuery,
  useToggleFavoriteMutation,
} = favoritesApi;