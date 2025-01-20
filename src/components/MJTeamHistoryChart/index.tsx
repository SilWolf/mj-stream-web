import { TournamentTeamStatistics } from '@/helpers/sanity.helper'
import { Team } from '@/models'
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
  teamAndStatistics: { team: Team; statistics: TournamentTeamStatistics }[]
}

function MJTeamHistoryChart({ teamAndStatistics }: Props) {
  const data = useMemo(() => {
    const count = Math.max(
      ...teamAndStatistics.map(({ statistics }) => statistics!.matchCount)
    )
    const result = Array(count + 1)
      .fill(undefined)
      .map(
        (_, index) =>
          ({
            name: index % 2 === 1 ? `W${Math.ceil(index / 2)}` : '',
          }) as Record<string, number> & { name: string }
      )

    for (const team of teamAndStatistics) {
      // result[0][team.team._id] = 0
      for (let i = 0; i < count; i++) {
        result[i][team.team._id] = team.statistics!.pointHistories[i]
      }
    }

    return result
  }, [teamAndStatistics])

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

        {teamAndStatistics.map((team) => (
          <Line
            key={team.team._id}
            type="linear"
            stroke="#FFF"
            strokeWidth={10}
            isAnimationActive={false}
            dataKey={team.team._id}
          />
        ))}

        {teamAndStatistics.map((team) => (
          <Line
            key={team.team._id}
            type="linear"
            stroke={team.team.color}
            strokeWidth={8}
            isAnimationActive={false}
            name={team.team.name!}
            dataKey={team.team._id}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default MJTeamHistoryChart
