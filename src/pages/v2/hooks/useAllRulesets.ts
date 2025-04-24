import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getRulesets } from '../services/api.service'

export default function useAllRulesets() {
  return useQuery({
    queryKey: ['v2-rulesets'],
    queryFn: getRulesets,
    initialData: [],
    placeholderData: keepPreviousData,
  })
}
