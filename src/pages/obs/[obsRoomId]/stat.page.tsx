import React, { useMemo } from 'react'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import MatchStatPage from '@/pages/match/[id]/stat/index.page'

type Props = {
  params: { obsRoomId: string }
}

export default function ObsStatPage({ params: { obsRoomId } }: Props) {
  const { data: obsInfo } = useFirebaseDatabaseByKey<string>(`obs/${obsRoomId}`)
  const obsPageParams = useMemo(
    () => ({ matchId: obsInfo?.matchId as string }),
    [obsInfo?.matchId]
  )

  if (!obsPageParams || !obsPageParams.matchId) {
    return <>讀取中…</>
  }

  return <MatchStatPage params={obsPageParams} />
}
