import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiGetTournamentById } from '../services/tournament.service'
import { createContext, useContext, useMemo } from 'react'
import { V2TournamentTeam } from '../models/V2Tournament.model'
import { V2MatchPlayer } from '../models/V2Match.model'

export const CurrentTournamentIdContext = createContext<string>('')

export default function useCurrentTournament() {
  const currentTournamentId = useContext(CurrentTournamentIdContext)

  const { data: tournament, ...queryRes } = useQuery({
    queryKey: ['v2-tournaments', currentTournamentId],
    queryFn: ({ queryKey }) => apiGetTournamentById(queryKey[1]),
    placeholderData: keepPreviousData,
    enabled: !!currentTournamentId,
  })

  const computedValues = useMemo(() => {
    const teams = tournament?.teams ?? []
    const teamsMap = teams.reduce(
      (map, obj) => ((map[obj.id] = obj), map),
      {} as Record<string, V2TournamentTeam>
    )

    const players = teams.map((team) => team.players).flat()
    const playersMap = players.reduce(
      (map, obj) => ((map[obj.id] = obj), map),
      {} as Record<string, V2MatchPlayer>
    )

    return { teams, teamsMap, players, playersMap }
  }, [tournament?.teams])

  return {
    ...queryRes,
    data: {
      tournament,
      ...computedValues,
    },
  }
}
