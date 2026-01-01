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
  query: ({ newsCategory = 'bitcoinmagazine', pageSize = 6 }) =>
    createRequest(`/sources/${newsCategory}?limit=${pageSize}`), // <--- use /sources
  transformResponse: (response) => {
    console.log('API Response:', response);
    const newsArray = Array.isArray(response) ? response : response.data || [];
    return {
      data: newsArray.map((item) => ({
        title: item.title || 'No title',
        description: item.description || 'No description',
        url: item.link || '#',
        image:
          item.thumbnail ||
          'https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg',
        publishedAt: item.pubDate || new Date().toISOString(),
        source: item.sourceId || 'Unknown',
      })),
    };
  },
}),

  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;