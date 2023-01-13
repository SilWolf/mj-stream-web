import { useMemo } from 'react'
import { Match, Player, PlayerIndex } from '../../models'
import {
  useFirebaseDatabase,
  useFirebaseDatabaseByKey,
} from '../../providers/firebaseDatabase.provider'

type MatchDTO = Omit<Match, 'players'> & {
  players: Record<
    PlayerIndex,
    Player & {
      rank: number
      score: number
      point: number
    }
  >
}

const useMatch = async (matchId: string) => {
  const fb = useFirebaseDatabase()

  const match = useMemo(async () => {
    const retrievedMatch = await fb.get<Match>(`/matches/${matchId}`)
    if (!retrievedMatch) {
      return undefined
    }

    const players = await Promise.all(
      Object.entries(retrievedMatch.players).map(([index, player]) =>
        player
          ? fb.get(`/players/${player.id}`).then((_retrievedPlayer) => ({
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
          Object.assign(prev[curr.index], curr.player)

          return prev
        },
        { ...retrievedMatch.players } as unknown as MatchDTO['players']
      )
    })

    return {
      ...retrievedMatch,
      players,
    }
  }, [fb, matchId])

  const { data: matchActiveRound } = useFirebaseDatabaseByKey(
    `matchRounds/${matchId}/active`
  )

  return { match, matchActiveRound }
}

export default useMatch
