import React, { useMemo } from 'react'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import MatchOverviewOverlayPage from '@/pages/match/[id]/overviewOverlay.page'

type Props = {
  params: { obsRoomId: string }
}

export default function ObsOverviewOverlayPage({
  params: { obsRoomId },
}: Props) {
  const { data: obsInfo } = useFirebaseDatabaseByKey<string>(`obs/${obsRoomId}`)
  const obsPageParams = useMemo(
    () => ({ matchId: obsInfo?.matchId as string }),
    [obsInfo?.matchId]
  )

  if (!obsPageParams || !obsPageParams.matchId) {
    return <>讀取中…</>
  }

  return <MatchOverviewOverlayPage params={obsPageParams} />
}
