import { apiGetMatchById } from '@/pages/v2/services/match.service'
import { useQuery } from '@tanstack/react-query'

const useDbMatchV2 = (matchId: string | null | undefined) =>
  useQuery({
    queryKey: ['matches', matchId],
    queryFn: ({ queryKey }) => apiGetMatchById(queryKey[1]!),
    enabled: !!matchId,
  })

export default useDbMatchV2
