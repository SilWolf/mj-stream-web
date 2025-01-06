import { apiGetMatchById } from '@/helpers/sanity.helper'
import { useQuery } from '@tanstack/react-query'

const useDbMatch = (matchId: string) =>
  useQuery({
    queryKey: ['matches', matchId],
    queryFn: ({ queryKey }) => apiGetMatchById(queryKey[1]),
    enabled: !!matchId,
  })

export default useDbMatch
