import React, { TableHTMLAttributes, useMemo } from 'react'
import { MatchRound, Player, PlayerIndex, RoundResultTypeEnum } from '@/models'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import MJMatchCounterSpan from '../MJMatchCounterSpan'
import MJAmountSpan from '../MJAmountSpan'
import MJPlayerInfoCardDiv from '../MJPlayerInfoCardDiv'

type Props = TableHTMLAttributes<HTMLTableElement> & {
  players: Record<
    PlayerIndex,
    Player & {
      position: number
      rank: number
      score: number
      point: number
    }
  >
  matchRounds: Record<string, MatchRound> | undefined
}

function MJMatchHistoryAmountSpan({ value }: { value: number }) {
  return (
    <MJAmountSpan
      value={value}
      positiveClassName="text-green-600"
      negativeClassName="text-red-600"
      signed
      hideZero
    />
  )
}

function MJMatchHistoryTable({ players, matchRounds, ...tableProps }: Props) {
  // const matchRoundsDatas = useMemo<Record<PlayerIndex, { value: number}[]>>(
  //   () => {
  //     const matchRoundValues = Object.values(matchRounds)

  //     return (['0', '1', '2', '3'] as PlayerIndex[]).map((playerIndex) => {
  //       return matchRoundValues.map((matchRound) => ({
  //         value: matchRound.playerResults[playerIndex].beforeScore
  //       }))
  //     })
  //   }),
  //   [matchRounds]
  // )

  // return (
  //   <LineChart width={300} height={100} data={data}>
  //   <Line type="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} />
  // </LineChart>
  // )
  return <>123</>
}

export default MJMatchHistoryTable
