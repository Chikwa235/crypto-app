import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cryptoApiHeaders = {
	  'x-rapidapi-key': '03070f158bmshc347ce2af1df5d4p194278jsn73f0b5bb8442',
	  'x-rapidapi-host': 'coinranking1.p.rapidapi.com'
}

const baseUrl = 'https://coinranking1.p.rapidapi.com/';

const createRequest = (url) => ({ url, headers: cryptoApiHeaders });

export const cryptoApi = createApi({
	reducerPath: 'cryptoApi',
	baseQuery: fetchBaseQuery({ baseUrl }),
	endpoints: (builder) => ({
		getCryptos: builder.query({
			query: (count) => createRequest(`/coins?limit=${count}`),

		})
	})
});

export const {
	useGetCryptosQuery,
} = cryptoApi;














