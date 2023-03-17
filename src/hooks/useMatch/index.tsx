import { useEffect, useMemo, useState } from 'react'
import {
  Match,
  MatchRound,
  MatchBase,
  Player,
  PlayerIndex,
  RawPlayer,
} from '../../models'
import {
  useFirebaseDatabase,
  useFirebaseDatabaseByKey,
} from '../../providers/firebaseDatabase.provider'

export type MatchDTO = MatchBase & {
  players: Record<
    PlayerIndex,
    Player & {
      position: number
      rank: number
      score: number
      point: number
    }
  >
}

const useMatch = (matchId: string) => {
  const fb = useFirebaseDatabase()
  const [match, setMatch] = useState<MatchDTO | undefined>()

  const {
    data: matchCurrentRound,
    update: updateCurrentMatchRound,
    push: pushMatchRound,
  } = useFirebaseDatabaseByKey<MatchRound>(`matchRounds`, {
    order: {
      byChild: 'matchId',
    },
    filter: {
      limitToLast: 1,
      equalTo: matchId,
    },
    returnSingle: true,
  })

  useEffect(() => {
    const asyncFn = async () => {
      const retrievedMatch = await fb.get<Match>(`/matches/${matchId}`)
      if (!retrievedMatch) {
        setMatch(undefined)
        return
      }

      const rawPlayers: Partial<
        Record<PlayerIndex, RawPlayer & { id: string }>
      > = {}
      const matchKeys = Object.keys(retrievedMatch)

      for (let i = 0; i < matchKeys.length; i += 1) {
        if (matchKeys[i].startsWith('player_')) {
          const retrivedPlayerId = matchKeys[i].substring(
            matchKeys[i].indexOf('_') + 1
          )
          const retrievedPlayer = retrievedMatch[matchKeys[i]]
          rawPlayers[retrievedPlayer.position] = {
            id: retrivedPlayerId,
            ...retrievedPlayer,
          }
        }
      }

      const players = await Promise.all(
        Object.entries(rawPlayers).map(([index, { id }]) =>
          id
            ? fb.get<Player>(`/players/${id}`).then((_retrievedPlayer) => ({
                index: index as unknown as PlayerIndex,
                player: _retrievedPlayer,
              }))
            : Promise.resolve({
                index: index as unknown as PlayerIndex,
                player: undefined,
              })
        )
      ).then((_players) => {
        return _players.reduce<MatchDTO['players']>(
          (prev, curr) => {
            if (curr.player) {
              Object.assign(prev[curr.index], { ...curr.player })
            }
            return prev
          },
          { ...rawPlayers } as unknown as MatchDTO['players']
        )
      })

      setMatch({
        ...retrievedMatch,
        players,
      })
    }

    asyncFn()
  }, [fb, matchId])

  const matchCurrentRoundDoras = useMemo(
    () => Object.values(matchCurrentRound?.doras ?? {}),
    [matchCurrentRound]
  )

  return {
    match,
    matchCurrentRound,
    matchCurrentRoundDoras,
    updateCurrentMatchRound,
    pushMatchRound,
  }
}

export default useMatch
