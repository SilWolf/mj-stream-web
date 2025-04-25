import React, { useMemo } from 'react'
import ControlPage from '@/pages/match/[id]/control/index.page'
import useObsRoom from '@/pages/v2/hooks/useObsRoom'

export default function V2PanelObsMatchControlPage() {
  const { data: obsRoom } = useObsRoom()
  const obsPageParams = useMemo(
    () => ({
      matchId: obsRoom?.activeMatch?.id ?? (obsRoom?.matchId as string),
    }),
    [obsRoom?.activeMatch?.id, obsRoom?.matchId]
  )

  if (!obsPageParams || !obsPageParams.matchId) {
    return <>讀取中…</>
  }

  return <ControlPage params={obsPageParams} />
}
