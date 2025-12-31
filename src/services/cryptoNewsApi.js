import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// New API headers
const cryptoNewsHeaders = {
  'x-rapidapi-key': '03070f158bmshc347ce2af1df5d4p194278jsn73f0b5bb8442',
  'x-rapidapi-host': 'news-api14.p.rapidapi.com',
};

// New API base URL
const baseUrl = 'https://news-api14.p.rapidapi.com/';

// Helper function to attach headers to request
const createRequest = (url) => ({ url, headers: cryptoNewsHeaders });

// RTK Query setup
export const cryptoNewsApi = createApi({
  reducerPath: 'cryptoNewsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      // Ensure newsCategory is never empty
      query: ({ newsCategory = 'Cryptocurrency' }) =>
        createRequest(`/v2/search/publishers?query=${encodeURIComponent(newsCategory)}`),
    }),
  }),
});

// Export the auto-generated hook
export const { useGetCryptoNewsQuery } = cryptoNewsApi;
