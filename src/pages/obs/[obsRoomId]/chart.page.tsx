import React from 'react'
import useMatch from '@/hooks/useMatch'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import MJMatchHistoryChart from '@/components/MJMatchHistoryChart'

type Props = {
  params: { obsRoomId: string }
}

export default function ObsChartPage({ params: { obsRoomId } }: Props) {
  const { data: obsInfo } = useFirebaseDatabaseByKey<string>(`obs/${obsRoomId}`)

  const { match, matchRounds, matchCurrentRound } = useMatch(
    obsInfo?.matchId ?? ''
  )

  if (!match || !matchCurrentRound) {
    return <div>對局讀取失敗。</div>
  }

  return (
    <div>
      <div className="container mx-auto my-8 px-8 space-y-6">
        <MJMatchHistoryChart
          players={match.players}
          matchRounds={matchRounds}
        />
      </div>
    </div>
  )
}
