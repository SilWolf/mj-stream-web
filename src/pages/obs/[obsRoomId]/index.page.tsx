import React, { useMemo } from 'react'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import ObsPage from '@/pages/match/[id]/obs.page'

type Props = {
  params: { obsRoomId: string }
}

export default function ObsRoomPage({ params: { obsRoomId } }: Props) {
  const { data: obsInfo } = useFirebaseDatabaseByKey<string>(`obs/${obsRoomId}`)
  const obsPageParams = useMemo(
    () => ({ matchId: obsInfo?.matchId as string }),
    [obsInfo?.matchId]
  )

  console.log(obsInfo)

  if (!obsPageParams || !obsPageParams.matchId) {
    return <>讀取中…</>
  }

  return <ObsPage params={obsPageParams} />
}
