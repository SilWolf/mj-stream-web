import { DB_MatchTournament } from '@/helpers/sanity.helper'
import React from 'react'
import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

type Props = {
  teams: DB_MatchTournament['teams']
}

function MJTeamHistoryChart({ teams }: Props) {
  const data = useMemo(() => {
    const count = teams[0].matchCount
    const result = Array(count + 1)
      .fill(undefined)
      .map(() => ({}) as Record<string, number>)

    for (const team of teams) {
      result[0][team.team._id] = 0
      for (let i = 0; i < count; i++) {
        result[i + 1][team.team._id] =
          team.pointHistories[i] ?? team.pointHistories.at(-1)
      }
    }

    return result
  }, [teams])

  console.log(data)

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis tick={{ fill: 'white' }} dataKey="name" />
        <YAxis
          tick={{ fill: 'white' }}
          width={80}
          allowDecimals={false}
          tickCount={5}
        />
        {/* <Legend /> */}

        {teams.map((team) => (
          <Line
            key={team.team._id}
            type="linear"
            stroke="#FFF"
            strokeWidth={10}
            isAnimationActive={false}
            dataKey={team.team._id}
          />
        ))}

        {teams.map((team) => (
          <Line
            key={team.team._id}
            type="linear"
            stroke={team.team.color}
            strokeWidth={8}
            isAnimationActive={false}
            name={team.team.name}
            dataKey={team.team._id}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default MJTeamHistoryChart
