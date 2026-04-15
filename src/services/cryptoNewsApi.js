import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * RapidAPI: "Cryptocurrency News" (v1)
 * Host: cryptocurrency-news2.p.rapidapi.com
 * Base URL: https://cryptocurrency-news2.p.rapidapi.com
 * Endpoints: /v1/coinjournal, /v1/coindesk, /v1/cointelegraph, /v1/bitcoinmagazine, etc.
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

// ---- Source helpers ----
const titleCase = (str) =>
  String(str || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

const sourceFromUrl = (url) => {
  try {
    if (!isNonEmptyString(url)) return '';
    // Only attempt URL parsing if it looks like an absolute URL
    if (!/^https?:\/\//i.test(url)) return '';

    const host = new URL(url).hostname.replace('www.', '');
    const root = host.split('.')[0] || '';
    return root ? titleCase(root) : '';
  } catch {
    return '';
  }
};

// Normalize each article defensively
const normalizeItem = (item, fallbackSource = '') => {
  const urlRaw = item?.url || item?.link || '';
  const url = isNonEmptyString(urlRaw) ? urlRaw : '#';

  const image =
    (isNonEmptyString(item?.thumbnail) && item.thumbnail) ||
    (isNonEmptyString(item?.image) && item.image) ||
    microlinkImage(url) ||
    DEMO_IMAGE;

  const sourceRaw =
    item?.source ||
    item?.sourceId ||
    item?.source_id ||
    item?.provider ||
    '';

  const source =
    (isNonEmptyString(sourceRaw) && titleCase(sourceRaw)) ||
    sourceFromUrl(url) ||
    (isNonEmptyString(fallbackSource) && titleCase(fallbackSource)) ||
    'Unknown';

  return {
    title: item?.title || 'No title',
    description: item?.description || item?.content || 'No description',
    url,
    image,
    publishedAt: item?.createdAt || item?.pubDate || item?.publishedAt || '',
    source,
  };
};

export const cryptoNewsApi = createApi({
  reducerPath: 'cryptoNewsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      query: ({ newsCategory = 'coinjournal', pageSize = 6 }) =>
        createRequest(`/v1/${newsCategory}`),

      transformResponse: (response, _meta, arg) => {
        const pageSize = Number(arg?.pageSize ?? 6);
        const newsCategory = arg?.newsCategory ?? 'coinjournal';

        // This API returns: { data: [...] }
        const newsArray = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        // Pass the category as a fallback source so UI never becomes "Unknown"
        const normalized = newsArray.map((it) => normalizeItem(it, newsCategory));

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