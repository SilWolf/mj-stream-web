import { useEffect, useMemo, useState } from 'react'
import { Match, MatchRound, Player, PlayerIndex } from '../../models'
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

const useMatch = (matchId: string) => {
  const fb = useFirebaseDatabase()
  const [match, setMatch] = useState<MatchDTO | undefined>()

  const { data: matchActiveRound } = useFirebaseDatabaseByKey<MatchRound>(
    `matchRounds/${matchId}/active`
  )

  useEffect(() => {
    const asyncFn = async () => {
      const retrievedMatch = await fb.get<Match>(`/matches/${matchId}`)
      if (!retrievedMatch) {
        setMatch(undefined)
        return
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

      setMatch({
        ...retrievedMatch,
        players,
      })
    }

    asyncFn()
  }, [fb, matchId])

  return { match, matchActiveRound }
}

export default useMatch
