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
          <h1 className="text-4xl">對局</h1>
        </div>
      </div>
      <table className="data-table w-full">
        <thead>
          <tr>
            <th>對局</th>
            <th>東家</th>
            <th>南家</th>
            <th>西家</th>
            <th>北家</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match._id}>
              <td>
                <a href={`/match/${match._id}`} target="_blank">
                  {match.name}
                </a>
              </td>
              <td>{match.players[0].name}</td>
              <td>{match.players[1].name}</td>
              <td>{match.players[2].name}</td>
              <td>{match.players[3].name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MatchesPage
