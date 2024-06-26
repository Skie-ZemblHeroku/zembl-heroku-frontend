import { UseQueryOptions, useQuery } from 'react-query'
import { QuoteData, getFetchQuoteListData } from '../api/quote'
import { AxiosError } from 'axios'

export const useFetchQuoteListDataQuery = (
  { token, quoteToken, isMultiSite }: FetchQuoteDataQueryPayload,
  { onSuccess, onError }: UseQueryOptions<QuoteData[], AxiosError>,
) =>
  useQuery({
    queryKey: ['fetchQuoteListData', token, quoteToken],
    queryFn: () => { 
      if(isMultiSite) return getFetchQuoteListData(quoteToken, token)
    },
    staleTime: Infinity,
    refetchInterval: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    retryOnMount: false,
    retryDelay: Infinity,
    enabled: true,
    onSuccess,
    onError,
  })

interface FetchQuoteDataQueryPayload {
  token: string
  quoteToken: string
  isMultiSite: boolean
}
