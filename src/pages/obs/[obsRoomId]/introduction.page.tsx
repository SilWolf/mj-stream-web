import React, { useMemo } from 'react'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import MatchIntroductionPage from '@/pages/match/[id]/introduction.page'

type Props = {
  params: { obsRoomId: string }
}

export default function ObsRoomIntroductionPage({
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

  return <MatchIntroductionPage params={obsPageParams} />
}
