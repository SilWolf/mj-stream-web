import React, { useEffect, useState } from 'react'
import useRealtimeMatch from '@/hooks/useRealtimeMatch'
import MJMatchHistoryTable from '@/components/MJMatchHistoryTable'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'

type Props = {
  params: { obsRoomId: string }
}

export default function ObsCarouselPage({ params: { obsRoomId } }: Props) {
  const { data: obsInfo } = useFirebaseDatabaseByKey<string>(`obs/${obsRoomId}`)

  const { rtMatch, rtMatchRounds, rtMatchCurrentRound } = useRealtimeMatch(
    obsInfo?.matchId ?? ''
  )

  const [screen, setScreen] = useState<number>(0)

  useEffect(() => {
    const fn = () => {
      setScreen((prev) => 1 - prev)
    }
    const intervalId = setInterval(fn, 8000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  if (!rtMatch || !rtMatchCurrentRound) {
    return <div>對局讀取失敗。</div>
  }

  return (
    <div>
      <div className={screen === 0 ? 'block' : 'hidden'}>
        <MJMatchHistoryTable
          players={rtMatch.players}
          matchRounds={rtMatchRounds}
          className="w-full table-auto"
        />
      </div>
      <div className={screen === 1 ? 'block' : 'hidden'}></div>
    </div>
  )
}
