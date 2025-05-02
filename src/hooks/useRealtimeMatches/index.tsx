import { useMemo } from 'react'
import { RealtimeMatch } from '../../models'
import { useFirebaseDatabaseByKey } from '../../providers/firebaseDatabase.provider'

export default function useRealtimeMatches() {
  const { data: rtMatchesMap } = useFirebaseDatabaseByKey<
    Record<string, RealtimeMatch>,
    Record<string, RealtimeMatch>,
    Partial<Record<string, RealtimeMatch>>
  >(`/matches`, {
    order: {
      byChild: 'createdAt',
    },
    filter: {
      limitToLast: 10,
    },
  })

  const rtMatches = useMemo(
    () =>
      Object.entries(rtMatchesMap ?? {})
        .map(([key, value]) => ({
          ...value,
          databaseId: value.databaseId || key,
          _id: key,
        }))
        .reverse(),
    [rtMatchesMap]
  )

  return { rtMatches }
}
