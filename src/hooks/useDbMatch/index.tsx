import { MatchDTO, apiGetMatchById } from '@/helpers/sanity.helper'
import { QueryFunction, useQuery } from '@tanstack/react-query'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const queryFn: QueryFunction<MatchDTO | undefined, any, never> = ({
  queryKey,
}) => apiGetMatchById(queryKey[1])

const useDbMatch = (matchId: string) =>
  useQuery({
    queryKey: ['matches', matchId],
    queryFn,
    enabled: !!matchId,
  })

export default useDbMatch
