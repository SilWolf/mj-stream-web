import { convertArrayToObject, getLastItemOfArray } from '@/utils/array.util'
import { useCallback, useMemo } from 'react'
import { Match, MatchRound } from '../../models'
import { useFirebaseDatabaseByKey } from '../../providers/firebaseDatabase.provider'

const useMatch = (matchId: string) => {
  const { data: match, update: updateMatch } = useFirebaseDatabaseByKey<
    Match,
    Match,
    Partial<Match>
  >(`/matches/${matchId}`)

  const {
    data: matchRounds,
    update: updateMatchRounds,
    push: pushMatchRound,
  } = useFirebaseDatabaseByKey<MatchRound>(`matchRounds`, {
    order: {
      byChild: 'matchId',
    },
    filter: {
      equalTo: matchId,
    },
  })

  const matchCurrentRound = useMemo(
    () => getLastItemOfArray(Object.values(matchRounds ?? {})) ?? undefined,
    [matchRounds]
  )

  const matchCurrentRoundDoras = useMemo(
    () => Object.values(matchCurrentRound?.doras ?? {}),
    [matchCurrentRound]
  )

  const updateCurrentMatchRound = useCallback(
    (payload: Partial<MatchRound>) => {
      const currentMatchRoundId = getLastItemOfArray(
        Object.keys(matchRounds ?? {})
      )

      if (!currentMatchRoundId) {
        return
      }

      updateMatchRounds({
        [currentMatchRoundId]: {
          ...matchCurrentRound,
          ...payload,
        } as MatchRound,
      })
    },
    [matchCurrentRound, matchRounds, updateMatchRounds]
  )

  const setCurrentRoundDoras = useCallback(
    (doraTileKeys: string[]) => {
      updateCurrentMatchRound({ doras: convertArrayToObject(doraTileKeys) })
    },
    [updateCurrentMatchRound]
  )

  const setMatchName = useCallback(
    (newMatchName: string) => {
      updateMatch({ name: newMatchName })
    },
    [updateMatch]
  )

  return {
    match,
    matchRounds,
    matchCurrentRound,
    matchCurrentRoundDoras,
    setMatchName,
    setCurrentRoundDoras,
    updateCurrentMatchRound,
    pushMatchRound,
  }
}

export default useMatch
