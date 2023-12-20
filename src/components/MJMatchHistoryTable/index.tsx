import React, { TableHTMLAttributes, useMemo } from 'react'
import {
  MatchRound,
  Player,
  PlayerIndex,
  PlayerResultWinnerOrLoserEnum,
  RoundResultTypeEnum,
} from '@/models'
import MJMatchCounterSpan from '../MJMatchCounterSpan'
import MJAmountSpan from '../MJAmountSpan'

const PlayerDiv = ({ player }: { player: Player }) => {
  return (
    <div className="border-b-4 pb-1" style={{ borderColor: player.color }}>
      <p className="text-sm text-neutral-600">{player.title}</p>
      <p className="font-bold">{player.name}</p>
    </div>
  )
}

type Props = TableHTMLAttributes<HTMLTableElement> & {
  players: Record<PlayerIndex, Player>
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

const PlayerResultMetadata = ({
  matchRound,
  playerIndex,
}: {
  matchRound: MatchRound
  playerIndex: PlayerIndex
}) => {
  return (
    <span>
      {matchRound.playerResults[playerIndex].isRiichi && (
        <span className="text-xs">立</span>
      )}
      {matchRound.resultType === RoundResultTypeEnum.Ron &&
        matchRound.playerResults[playerIndex].type ===
          PlayerResultWinnerOrLoserEnum.Lose && (
          <span className="text-xs">統</span>
        )}
      {matchRound.resultType === RoundResultTypeEnum.Ron &&
        matchRound.playerResults[playerIndex].type ===
          PlayerResultWinnerOrLoserEnum.Win && (
          <span className="text-xs">和</span>
        )}
      {matchRound.resultType === RoundResultTypeEnum.SelfDrawn &&
        matchRound.playerResults[playerIndex].type ===
          PlayerResultWinnerOrLoserEnum.Win && (
          <span className="text-xs">摸</span>
        )}
      {matchRound.resultType === RoundResultTypeEnum.Exhausted &&
        matchRound.playerResults[playerIndex].type ===
          PlayerResultWinnerOrLoserEnum.Win && (
          <span className="text-xs">聽</span>
        )}
    </span>
  )
}

function MJMatchHistoryTable({ players, matchRounds, ...tableProps }: Props) {
  const matchRoundsEntries = useMemo(
    () => Object.entries(matchRounds ?? {}),
    [matchRounds]
  )

  return (
    <table {...tableProps}>
      <thead>
        <tr className="border-b border-gray-400 [&>th]:p-2">
          <th className="whitespace-nowrap px-16">局數</th>
          <th className="w-1/4">
            <PlayerDiv player={players['0']} />
          </th>
          <th className="w-1/4">
            <PlayerDiv player={players['1']} />
          </th>
          <th className="w-1/4">
            <PlayerDiv player={players['2']} />
          </th>
          <th className="w-1/4">
            <PlayerDiv player={players['3']} />
          </th>
        </tr>
      </thead>
      <tbody>
        {matchRoundsEntries[0] && (
          <tr className="even:bg-gray-200 [&>td]:p-2">
            <td className="text-center" />
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
                <td className="text-center whitespace-nowrap px-16">
                  手動調整
                </td>
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
              <td className="text-center whitespace-nowrap">
                <MJMatchCounterSpan
                  roundCount={matchRound.roundCount}
                  extendedRoundCount={matchRound.extendedRoundCount}
                  max={8}
                  className="px-4"
                />
              </td>
              <td className="text-center">
                <MJMatchHistoryAmountSpan
                  value={
                    matchRound.playerResults['0'].afterScore -
                    matchRound.playerResults['0'].beforeScore
                  }
                />{' '}
                <PlayerResultMetadata matchRound={matchRound} playerIndex="0" />
              </td>
              <td className="text-center">
                <MJMatchHistoryAmountSpan
                  value={
                    matchRound.playerResults['1'].afterScore -
                    matchRound.playerResults['1'].beforeScore
                  }
                />{' '}
                <PlayerResultMetadata matchRound={matchRound} playerIndex="1" />
              </td>
              <td className="text-center">
                <MJMatchHistoryAmountSpan
                  value={
                    matchRound.playerResults['2'].afterScore -
                    matchRound.playerResults['2'].beforeScore
                  }
                />{' '}
                <PlayerResultMetadata matchRound={matchRound} playerIndex="2" />
              </td>
              <td className="text-center">
                <MJMatchHistoryAmountSpan
                  value={
                    matchRound.playerResults['3'].afterScore -
                    matchRound.playerResults['3'].beforeScore
                  }
                />{' '}
                <PlayerResultMetadata matchRound={matchRound} playerIndex="3" />
              </td>
            </tr>
          )
        })}
        {matchRoundsEntries[matchRoundsEntries.length - 1] && (
          <tr className="even:bg-gray-200 [&>td]:p-2">
            <td className="text-center whitespace-nowrap px-16" />
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
