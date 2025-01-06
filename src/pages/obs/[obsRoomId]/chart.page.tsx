import React from 'react'
import useRealtimeMatch from '@/hooks/useRealtimeMatch'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'

type Props = {
  params: { obsRoomId: string }
}

export default function ObsChartPage({ params: { obsRoomId } }: Props) {
  const { data: obsInfo } = useFirebaseDatabaseByKey<string>(`obs/${obsRoomId}`)

  const { match, matchCurrentRound } = useRealtimeMatch(obsInfo?.matchId ?? '')

  if (!match || !matchCurrentRound) {
    return <div>對局讀取失敗。</div>
  }

  return (
    <div>
      <div className="container mx-auto my-8 px-8 space-y-6"></div>
    </div>
  )
}
