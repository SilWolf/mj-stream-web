import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiGetTournamentById } from '../services/tournament.service'
import { createContext, useContext } from 'react'

export const CurrentTournamentIdContext = createContext<string>('')

export default function useCurrentTournament() {
  const currentTournamentId = useContext(CurrentTournamentIdContext)

  return useQuery({
    queryKey: ['v2-tournaments', currentTournamentId],
    queryFn: ({ queryKey }) => apiGetTournamentById(queryKey[1]),
    placeholderData: keepPreviousData,
    enabled: !!currentTournamentId,
  })
}
