import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiGetRulesetById } from '../services/ruleset.service'

export default function useRuleset(id: string) {
  return useQuery({
    queryKey: ['v2-rulesets', id],
    queryFn: ({ queryKey }) => apiGetRulesetById(queryKey[1]),
    enabled: !!id,
    initialData: undefined,
    placeholderData: keepPreviousData,
  })
}
