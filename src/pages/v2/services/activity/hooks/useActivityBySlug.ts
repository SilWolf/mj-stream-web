import { useQuery } from '@tanstack/react-query'
import { apiGetActivityBySlug } from '../service'

export const fn = (slug: string) => apiGetActivityBySlug(slug)

export default function useActivityBySlug(slug: string | null | undefined) {
  return useQuery({
    queryKey: ['activity', 'bySlug', slug],
    queryFn: () => fn(slug!),
    enabled: !!slug,
  })
}
