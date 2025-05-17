import { useQuery } from '@tanstack/react-query'
import { apiGetTournamentById } from '../service'

export const fn = (id: string) => apiGetTournamentById(id)

export default function useTournamentById(id: string | null | undefined) {
  return useQuery({
    queryKey: ['tournament', 'byId', id],
    queryFn: () => fn(id!),
    enabled: !!id,
  })
}
