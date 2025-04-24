import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiGetRulesets } from '../services/ruleset.service'

export default function useAllRulesets() {
  return useQuery({
    queryKey: ['v2-rulesets'],
    queryFn: apiGetRulesets,
    initialData: [],
    placeholderData: keepPreviousData,
  })
}
