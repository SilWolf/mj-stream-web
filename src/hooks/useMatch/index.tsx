import { convertArrayToObject, getLastItemOfArray } from '@/utils/array.util'
import { useCallback, useMemo } from 'react'
import { RealtimeMatch, RealtimeMatchRound } from '../../models'
import { useFirebaseDatabaseByKey } from '../../providers/firebaseDatabase.provider'

const useMatch = (matchId: string) => {
  const { data: rtMatch, update: updateMatch } = useFirebaseDatabaseByKey<
    RealtimeMatch,
    RealtimeMatch,
    Partial<RealtimeMatch>
  >(`/matches/${matchId}`)

  const {
    data: rtMatchRounds,
    update: updateMatchRounds,
    push: pushMatchRound,
  } = useFirebaseDatabaseByKey<RealtimeMatchRound>(`matchRounds`, {
    order: {
      byChild: 'matchId',
    },
    filter: {
      equalTo: matchId,
    },
  })

  const rtMatchCurrentRound = useMemo(
    () => getLastItemOfArray(Object.values(rtMatchRounds ?? {})) ?? undefined,
    [rtMatchRounds]
  )

  const rtMatchCurrentRoundDoras = useMemo(
    () => Object.values(rtMatchCurrentRound?.doras ?? {}),
    [rtMatchCurrentRound]
  )

  const updateMatchRoundById = useCallback(
    (id: string, payload: Partial<RealtimeMatchRound>) => {
      const oldMatchRound = rtMatchRounds?.[id]

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
    [rtMatchRounds, updateMatchRounds]
  )

  const updateCurrentMatchRound = useCallback(
    (payload: Partial<RealtimeMatchRound>) => {
      const currentMatchRoundId = getLastItemOfArray(
        Object.keys(rtMatchRounds ?? {})
      )

      if (!currentMatchRoundId) {
        return
      }

      updateMatchRounds({
        [currentMatchRoundId]: {
          ...rtMatchCurrentRound,
          ...payload,
        } as RealtimeMatchRound,
      })
    },
    [rtMatchCurrentRound, rtMatchRounds, updateMatchRounds]
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
    (newPlayers: RealtimeMatch['players']) => {
      updateMatch({ players: newPlayers })
    },
    [updateMatch]
  )

  const setMatchActiveResultDetail = useCallback(
    (newResultDetail: RealtimeMatch['activeResultDetail'] | null) => {
      updateMatch({ activeResultDetail: newResultDetail })
    },
    [updateMatch]
  )

  const setMatchPointDisplay = useCallback(
    (newShowPoints: RealtimeMatch['showPoints'] | null) => {
      updateMatch({ showPoints: newShowPoints })
    },
    [updateMatch]
  )

  const setMatchHideHeaderDisplay = useCallback(
    (newHideHeader: RealtimeMatch['hideHeader'] | null) => {
      updateMatch({ hideHeader: newHideHeader })
    },
    [updateMatch]
  )

  const setMatchHidePlayersDisplay = useCallback(
    (newHidePlayers: RealtimeMatch['hidePlayers'] | null) => {
      updateMatch({ hidePlayers: newHidePlayers })
    },
    [updateMatch]
  )

  const setMatchRoundHasBroadcastedToTrue = useCallback(
    (matchRoundId: string) => {
      updateMatchRounds({
        [matchRoundId]: {
          ...rtMatchRounds?.[matchRoundId],
          hasBroadcasted: true,
        },
      })
    },
    [rtMatchRounds, updateMatchRounds]
  )

  return {
    rtMatch,
    rtMatchRounds,
    rtMatchCurrentRound,
    rtMatchCurrentRoundDoras,
    setMatchName,
    setMatchPlayers,
    setMatchPointDisplay,
    setMatchHideHeaderDisplay,
    setMatchHidePlayersDisplay,
    setMatchActiveResultDetail,
    setMatchRoundHasBroadcastedToTrue,
    setCurrentRoundDoras,
    updateMatchRoundById,
    updateCurrentMatchRound,
    pushMatchRound,
  }
}

export default useMatch
