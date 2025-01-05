import { MatchDTO, apiGetMatchById } from '@/helpers/sanity.helper'
import { QueryFunction, useQuery } from '@tanstack/react-query'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const queryFn: QueryFunction<MatchDTO | undefined, any, never> = ({
  queryKey,
}) =>
  apiGetMatchById(
    queryKey[1],
    queryKey[2],
    '27a1a61b-4829-4371-8fbe-15cbef1bfcee'
  )

const useDbMatch = (matchId: string, withStatistics?: boolean) =>
  useQuery({
    queryKey: ['matches', matchId, withStatistics],
    queryFn,
    enabled: !!matchId,
  })

export default useDbMatch
