import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cryptoNewsHeaders = {
  'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
  'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_NEWS_HOST,
};

const baseUrl = 'https://cryptocurrency-news-api2.p.rapidapi.com';

const createRequest = (url) => ({
  url,
  headers: cryptoNewsHeaders,
});

const DEMO_IMAGE =
  'https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg';

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

// Per-article preview image (works from frontend; no CORS issues)
const microlinkImage = (url) => {
  if (!isNonEmptyString(url) || url === '#') return null;
  return `https://image.microlink.io/${encodeURIComponent(url)}`;
};

export const cryptoNewsApi = createApi({
  reducerPath: 'cryptoNewsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      query: ({ newsCategory = 'bitcoinmagazine', pageSize = 6 }) =>
        createRequest(`/sources/${newsCategory}?limit=${pageSize}`),

      transformResponse: (response) => {
        console.log('API Response:', response);

        const newsArray = Array.isArray(response) ? response : response.data || [];

        return {
          data: newsArray.map((item) => {
            const url = item.link || item.url || '#';

            // Use thumbnail if present; otherwise use a per-article preview image; otherwise demo
            const image =
              (isNonEmptyString(item.thumbnail) && item.thumbnail) ||
              microlinkImage(url) ||
              DEMO_IMAGE;

            return {
              title: item.title || 'No title',
              description: item.description || item.content || 'No description',
              url,
              image,
              publishedAt: item.pubDate || item.publishedAt || new Date().toISOString(),

              // Your API objects show `source: "bitcoinmagazine"` in the console
              source: item.source || item.sourceId || item.source_id || 'Unknown',
            };
          }),
        };
      },
    }),
  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;