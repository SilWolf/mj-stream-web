import React, { useMemo } from 'react'
import { MatchRound, Player, PlayerIndex, RoundResultTypeEnum } from '@/models'
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts'

import { generateMatchRoundText } from '@/helpers/mahjong.helper'

type Props = {
  players: Record<PlayerIndex, Player>
  matchRounds: Record<string, MatchRound> | undefined
}

function MJMatchHistoryTable({ players, matchRounds }: Props) {
  const data = useMemo(() => {
    const matchRoundsArray = Object.values(matchRounds ?? {})
    const lastMatchRound = matchRoundsArray[matchRoundsArray.length - 1]

    return [
      ...matchRoundsArray.map((matchRound) => ({
        name:
          matchRound.resultType === RoundResultTypeEnum.Hotfix
            ? '分數調整'
            : generateMatchRoundText(
                matchRound.roundCount,
                matchRound.extendedRoundCount,
                8
              ),
        p0: matchRound.playerResults['0'].beforeScore,
        p1: matchRound.playerResults['1'].beforeScore,
        p2: matchRound.playerResults['2'].beforeScore,
        p3: matchRound.playerResults['3'].beforeScore,
      })),
      {
        name: '完結',
        p0: lastMatchRound.playerResults['0'].afterScore,
        p1: lastMatchRound.playerResults['1'].afterScore,
        p2: lastMatchRound.playerResults['2'].afterScore,
        p3: lastMatchRound.playerResults['3'].afterScore,
      },
    ]
  }, [matchRounds])

  return (
    <div className="bg-white">
      {/* <ResponsiveContainer width="100%" height={800}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: 'black' }} />
          <YAxis tick={{ fill: 'black' }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="p0"
            stroke={players['0'].color}
            strokeWidth={4}
            name={`[${players['0'].title}] ${players['0'].name}`}
          />
          <Line
            type="monotone"
            dataKey="p1"
            stroke={players['1'].color}
            strokeWidth={4}
            name={`[${players['1'].title}] ${players['1'].name}`}
          />
          <Line
            type="monotone"
            dataKey="p2"
            stroke={players['2'].color}
            strokeWidth={4}
            name={`[${players['2'].title}] ${players['2'].name}`}
          />
          <Line
            type="monotone"
            dataKey="p3"
            stroke={players['3'].color}
            strokeWidth={4}
            name={`[${players['3'].title}] ${players['3'].name}`}
          />
        </LineChart>
      </ResponsiveContainer> */}
    </div>
  )
}

export default MJMatchHistoryTable
