
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * RapidAPI: "Cryptocurrency News" (v1)
 * Host: cryptocurrency-news2.p.rapidapi.com
 * Base URL: https://cryptocurrency-news2.p.rapidapi.com
 * Endpoints look like: /v1/coinjournal, /v1/coindesk, /v1/cointelegraph, etc.
 */

const cryptoNewsHeaders = {
  'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
  'x-rapidapi-host': 'cryptocurrency-news2.p.rapidapi.com',
};

const baseUrl = 'https://cryptocurrency-news2.p.rapidapi.com';

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

// Normalize each article defensively (different sources sometimes vary)
const normalizeItem = (item) => {
  const url = item?.url || item?.link || '#';

  const image =
    (isNonEmptyString(item?.thumbnail) && item.thumbnail) ||
    (isNonEmptyString(item?.image) && item.image) ||
    microlinkImage(url) ||
    DEMO_IMAGE;

  return {
    title: item?.title || 'No title',
    description: item?.description || item?.content || 'No description',
    url,
    image,
    publishedAt: item?.createdAt || item?.pubDate || item?.publishedAt || '',
    source:
      item?.source ||
      item?.sourceId ||
      item?.source_id ||
      item?.provider ||
      'Unknown',
  };
};

export const cryptoNewsApi = createApi({
  reducerPath: 'cryptoNewsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      // newsCategory examples: coinjournal, coindesk, cointelegraph, decrypt, bitcoinmagazine, etc.
      // NOTE: This API generally does NOT support `limit`; we do slicing client-side.
      query: ({ newsCategory = 'coinjournal', pageSize = 6 }) =>
        createRequest(`/v1/${newsCategory}`),

      transformResponse: (response, _meta, arg) => {
        const pageSize = Number(arg?.pageSize ?? 6);

        // This API returns: { data: [...] }
        const newsArray = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        const normalized = newsArray.map(normalizeItem);

        return {
          data:
            Number.isFinite(pageSize) && pageSize > 0
              ? normalized.slice(0, pageSize)
              : normalized,
        };
      },
    }),
  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;