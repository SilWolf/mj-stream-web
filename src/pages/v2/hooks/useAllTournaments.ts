import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiGetTournaments } from '../services/tournament/service'

export default function useAllTournaments() {
  return useQuery({
    queryKey: ['v2-tournaments'],
    queryFn: apiGetTournaments,
    placeholderData: keepPreviousData,
  })
}
