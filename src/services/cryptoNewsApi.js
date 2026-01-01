import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cryptoNewsHeaders = {
  'x-rapidapi-key': '03070f158bmshc347ce2af1df5d4p194278jsn73f0b5bb8442',
  'x-rapidapi-host': 'cryptocurrency-news-api2.p.rapidapi.com',
};

const baseUrl = 'https://cryptocurrency-news-api2.p.rapidapi.com';

const createRequest = (url) => ({
  url,
  headers: cryptoNewsHeaders,
});

export const cryptoNewsApi = createApi({
  reducerPath: 'cryptoNewsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      query: ({ newsCategory = 'bitcoin', pageSize = 6 }) =>
        createRequest(`/sources/${newsCategory}`),

      // 🔑 Transform the API response into a usable format
      transformResponse: (response) => {
        console.log('API Response:', response); // DEBUG: see what comes from the API

        // The API might return an array directly, so handle both cases
        const newsArray = Array.isArray(response) ? response : response.data || [];

        return {
          data: newsArray.map((item) => ({
            title: item.title,
            description: item.description,
            url: item.link,
            image: item.thumbnail,
            publishedAt: item.pubDate,
            source: item.sourceId,
          })),
        };
      },
    }),
  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;
