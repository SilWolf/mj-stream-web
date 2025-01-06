import React from 'react'
import useRealtimeMatch from '@/hooks/useRealtimeMatch'
import MJMatchHistoryTable from '@/components/MJMatchHistoryTable'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'

type Props = {
  params: { obsRoomId: string }
}

export default function ObsScorePage({ params: { obsRoomId } }: Props) {
  const { data: obsInfo } = useFirebaseDatabaseByKey<string>(`obs/${obsRoomId}`)

  const { rtMatch, rtMatchRounds, rtMatchCurrentRound } = useRealtimeMatch(
    obsInfo?.matchId ?? ''
  )

  if (!rtMatch || !rtMatchCurrentRound) {
    return <div>對局讀取失敗。</div>
  }

  return (
    <div>
      <div className="container mx-auto my-8 px-8 space-y-6">
        <MJMatchHistoryTable
          players={rtMatch.players}
          matchRounds={rtMatchRounds}
          className="w-full table-auto"
        />
      </div>
    </div>
  )
}
