import React, { useEffect, useState } from 'react'
import useMatch from '@/hooks/useMatch'
import MJMatchHistoryTable from '@/components/MJMatchHistoryTable'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import MJMatchHistoryChart from '@/components/MJMatchHistoryChart'

type Props = {
  params: { obsRoomId: string }
}

export default function ObsCarouselPage({ params: { obsRoomId } }: Props) {
  const { data: obsInfo } = useFirebaseDatabaseByKey<string>(`obs/${obsRoomId}`)

  const { match, matchRounds, matchCurrentRound } = useMatch(
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

  if (!match || !matchCurrentRound) {
    return <div>對局讀取失敗。</div>
  }

  return (
    <div>
      <div className={screen === 0 ? 'block' : 'hidden'}>
        <MJMatchHistoryTable
          players={match.players}
          matchRounds={matchRounds}
          className="w-full table-auto"
        />
      </div>
      <div className={screen === 1 ? 'block' : 'hidden'}>
        <MJMatchHistoryChart
          players={match.players}
          matchRounds={matchRounds}
        />
      </div>
    </div>
  )
}
