import { Match } from '@/models'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import React, { useMemo } from 'react'

function MatchesPage() {
  const { data: matchesMap } = useFirebaseDatabaseByKey<Match>('matches')

  const matches = useMemo(
    () =>
      Object.entries(matchesMap ?? {})
        .reverse()
        .map(([key, value]) => ({
          ...value,
          _id: key,
        })),
    [matchesMap]
  )

  return (
    <div className="container mx-auto max-w-screen-sm space-y-4 py-16">
      <div className="shrink-0">
        <a href="/" className="underline">
          &lt; 回上一頁
        </a>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl">玩家</h1>
        </div>
      </div>
      <div className="space-y-2">{matches.map(() => '123')}</div>
    </div>
  )
}

export default MatchesPage
