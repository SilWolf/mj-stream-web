import { apiGetMatchByIdWithStatistics } from '@/helpers/sanity.helper'
import { useQuery } from '@tanstack/react-query'

const useDbMatchWithStatistics = (matchId: string) =>
  useQuery({
    queryKey: ['matches', matchId],
    queryFn: ({ queryKey }) => apiGetMatchByIdWithStatistics(queryKey[1]),
    enabled: !!matchId,
  })

export default useDbMatchWithStatistics
