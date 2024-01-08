import { MatchDTO, apiGetMatchById } from '@/helpers/sanity.helper'
import { QueryFunction, useQuery } from '@tanstack/react-query'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const queryFn: QueryFunction<MatchDTO | undefined, any, never> = ({
  queryKey,
}) => apiGetMatchById(queryKey[1], queryKey[2])

const useDbMatch = (matchId: string, withStatistics?: boolean) =>
  useQuery({
    queryKey: ['matches', matchId, withStatistics],
    queryFn,
    enabled: !!matchId,
  })

export default useDbMatch
