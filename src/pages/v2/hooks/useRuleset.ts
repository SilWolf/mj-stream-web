import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getRulesetById } from '../services/api.service'

export default function useRuleset(id: string) {
  return useQuery({
    queryKey: ['v2-rulesets', id],
    queryFn: ({ queryKey }) => getRulesetById(queryKey[1]),
    enabled: !!id,
    initialData: undefined,
    placeholderData: keepPreviousData,
  })
}
