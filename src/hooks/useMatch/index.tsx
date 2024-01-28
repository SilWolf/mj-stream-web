import { convertArrayToObject, getLastItemOfArray } from '@/utils/array.util'
import { useCallback, useMemo } from 'react'
import { Match, MatchRound } from '../../models'
import { useFirebaseDatabaseByKey } from '../../providers/firebaseDatabase.provider'

const useMatch = (matchId: string) => {
  const { data: match, update: updateMatch } = useFirebaseDatabaseByKey<
    Match,
    Match,
    Partial<Match>
  >(`/v1/matches/${matchId}`)

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

  const updateMatchRoundById = useCallback(
    (id: string, payload: Partial<MatchRound>) => {
      const oldMatchRound = matchRounds?.[id]

      if (!oldMatchRound) {
        return
      }

      updateMatchRounds({
        [id]: {
          ...oldMatchRound,
          ...payload,
        } as MatchRound,
      })
    },
    [matchRounds, updateMatchRounds]
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

  const setMatchPlayers = useCallback(
    (newPlayers: Match['players']) => {
      updateMatch({ players: newPlayers })
    },
    [updateMatch]
  )

  const setMatchActiveResultDetail = useCallback(
    (newResultDetail: Match['activeResultDetail'] | null) => {
      updateMatch({ activeResultDetail: newResultDetail })
    },
    [updateMatch]
  )

  const setMatchPointDisplay = useCallback(
    (newShowPoints: Match['showPoints'] | null) => {
      updateMatch({ showPoints: newShowPoints })
    },
    [updateMatch]
  )

  const setMatchHideHeaderDisplay = useCallback(
    (newHideHeader: Match['hideHeader'] | null) => {
      updateMatch({ hideHeader: newHideHeader })
    },
    [updateMatch]
  )

  const setMatchRoundHasBroadcastedToTrue = useCallback(
    (matchRoundId: string) => {
      updateMatchRounds({
        [matchRoundId]: {
          ...matchRounds?.[matchRoundId],
          hasBroadcasted: true,
        },
      })
    },
    [matchRounds, updateMatchRounds]
  )

  return {
    match,
    matchRounds,
    matchCurrentRound,
    matchCurrentRoundDoras,
    setMatchName,
    setMatchPlayers,
    setMatchPointDisplay,
    setMatchHideHeaderDisplay,
    setMatchActiveResultDetail,
    setMatchRoundHasBroadcastedToTrue,
    setCurrentRoundDoras,
    updateMatchRoundById,
    updateCurrentMatchRound,
    pushMatchRound,
  }
}

export default useMatch
