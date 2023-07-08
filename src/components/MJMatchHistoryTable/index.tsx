import React, { TableHTMLAttributes, useMemo } from 'react'
import useMatch from '@/hooks/useMatch'
import { RoundResultTypeEnum } from '@/models'
import MJMatchCounterSpan from '../MJMatchCounterSpan'
import MJAmountSpan from '../MJAmountSpan'

type Props = TableHTMLAttributes<HTMLTableElement> & {
  matchId: string
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

function MJMatchHistoryTable({ matchId, ...tableProps }: Props) {
  const { match, matchRounds } = useMatch(matchId)

  const matchRoundsEntries = useMemo(
    () => Object.entries(matchRounds ?? []),
    [matchRounds]
  )

  return (
    <table {...tableProps}>
      <thead>
        <tr className="border-b border-gray-400 [&>th]:p-2">
          <th>局數</th>
          <th>{match?.players['0'].name}</th>
          <th>{match?.players['1'].name}</th>
          <th>{match?.players['2'].name}</th>
          <th>{match?.players['3'].name}</th>
        </tr>
      </thead>
      <tbody>
        {matchRoundsEntries[0] && (
          <tr className="even:bg-gray-200 [&>td]:p-2">
            <td className="text-center w-36" />
            <td className="text-center">
              <MJAmountSpan
                value={matchRoundsEntries[0][1].playerResults['0'].beforeScore}
              />
            </td>
            <td className="text-center">
              <MJAmountSpan
                value={matchRoundsEntries[0][1].playerResults['1'].beforeScore}
              />
            </td>
            <td className="text-center">
              <MJAmountSpan
                value={matchRoundsEntries[0][1].playerResults['2'].beforeScore}
              />
            </td>
            <td className="text-center">
              <MJAmountSpan
                value={matchRoundsEntries[0][1].playerResults['3'].beforeScore}
              />
            </td>
          </tr>
        )}
        {matchRoundsEntries.map(([matchRoundId, matchRound]) => {
          if (matchRound.resultType === RoundResultTypeEnum.Hotfix) {
            return (
              <tr key={matchRoundId} className="even:bg-gray-200 [&>td]:p-2">
                <td className="text-center">手動調整</td>
                <td className="text-center">
                  {matchRound.playerResults['0'].afterScore}
                </td>
                <td className="text-center">
                  {matchRound.playerResults['1'].afterScore}
                </td>
                <td className="text-center">
                  {matchRound.playerResults['2'].afterScore}
                </td>
                <td className="text-center">
                  {matchRound.playerResults['3'].afterScore}
                </td>
              </tr>
            )
          }

          return (
            <tr key={matchRoundId} className="even:bg-gray-200 [&>td]:p-2">
              <td className="text-center">
                <MJMatchCounterSpan
                  roundCount={matchRound.roundCount}
                  extendedRoundCount={matchRound.extendedRoundCount}
                  max={8}
                />
              </td>
              <td className="text-center">
                <MJMatchHistoryAmountSpan
                  value={
                    matchRound.playerResults['0'].afterScore -
                    matchRound.playerResults['0'].beforeScore
                  }
                />
              </td>
              <td className="text-center">
                <MJMatchHistoryAmountSpan
                  value={
                    matchRound.playerResults['1'].afterScore -
                    matchRound.playerResults['1'].beforeScore
                  }
                />
              </td>
              <td className="text-center">
                <MJMatchHistoryAmountSpan
                  value={
                    matchRound.playerResults['2'].afterScore -
                    matchRound.playerResults['2'].beforeScore
                  }
                />
              </td>
              <td className="text-center">
                <MJMatchHistoryAmountSpan
                  value={
                    matchRound.playerResults['3'].afterScore -
                    matchRound.playerResults['3'].beforeScore
                  }
                />
              </td>
            </tr>
          )
        })}
        {matchRoundsEntries[matchRoundsEntries.length - 1] && (
          <tr className="even:bg-gray-200 [&>td]:p-2">
            <td className="text-center" />
            <td className="text-center font-bold text-lg">
              <MJAmountSpan
                value={
                  matchRoundsEntries[matchRoundsEntries.length - 1][1]
                    .playerResults['0'].afterScore
                }
              />
            </td>
            <td className="text-center font-bold text-lg">
              <MJAmountSpan
                value={
                  matchRoundsEntries[matchRoundsEntries.length - 1][1]
                    .playerResults['1'].afterScore
                }
              />
            </td>
            <td className="text-center font-bold text-lg">
              <MJAmountSpan
                value={
                  matchRoundsEntries[matchRoundsEntries.length - 1][1]
                    .playerResults['2'].afterScore
                }
              />
            </td>
            <td className="text-center font-bold text-lg">
              <MJAmountSpan
                value={
                  matchRoundsEntries[matchRoundsEntries.length - 1][1]
                    .playerResults['3'].afterScore
                }
              />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default MJMatchHistoryTable
