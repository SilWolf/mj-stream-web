import { convertArrayToObject, getLastItemOfArray } from '@/utils/array.util'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Match, MatchRound } from '../../models'
import {
  useFirebaseDatabase,
  useFirebaseDatabaseByKey,
} from '../../providers/firebaseDatabase.provider'

const useMatch = (matchId: string) => {
  const fb = useFirebaseDatabase()
  const [match, setMatch] = useState<Match | undefined>()

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
        },
      })
    },
    [matchCurrentRound, matchRounds, updateMatchRounds]
  )

  useEffect(() => {
    const asyncFn = async () => {
      if (!matchId) {
        setMatch(undefined)
        return
      }

      const retrievedMatch = await fb.get<Match>(`/matches/${matchId}`)
      if (!retrievedMatch) {
        setMatch(undefined)
        return
      }

      setMatch({
        ...retrievedMatch,
      })
    }

    asyncFn()
  }, [fb, matchId])

  const setCurrentRoundDoras = useCallback(
    (doraTileKeys: string[]) => {
      updateCurrentMatchRound({ doras: convertArrayToObject(doraTileKeys) })
    },
    [updateCurrentMatchRound]
  )

  return {
    match,
    matchRounds,
    matchCurrentRound,
    matchCurrentRoundDoras,
    setCurrentRoundDoras,
    updateCurrentMatchRound,
    pushMatchRound,
  }
}

export default useMatch
