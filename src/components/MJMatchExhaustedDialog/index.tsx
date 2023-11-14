/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import MJUIDialogV2, { MJUIDialogV2Props } from '@/components/MJUI/MJUIDialogV2'
import MJUIButton from '@/components/MJUI/MJUIButton'
import {
  Match,
  MatchRound,
  PlayerIndex,
  PlayerResultWinnerOrLoserEnum,
  RoundResultTypeEnum,
} from '@/models'
import { getPlayerPosition } from '@/helpers/mahjong.helper'
import MJMatchCounterSpan from '../MJMatchCounterSpan'
import MJUISwitch from '../MJUI/MJUISwitch'
import MJAmountSpan from '../MJAmountSpan'

export type MJMatchRonProps = Pick<MJUIDialogV2Props, 'open' | 'onClose'> & {
  match: Match
  currentMatchRound: MatchRound
  onSubmit?: (resultMatchRound: MatchRound) => unknown
}

export default function MJMatchExhaustedDialog({
  match,
  currentMatchRound,
  onSubmit,
  ...dialogProps
}: MJMatchRonProps) {
  const players = useMemo(() => {
    const _players = (
      Object.keys(match.players) as unknown as PlayerIndex[]
    ).map((index) => ({
      index: index.toString(),
      name: match.players[index].name,
      position: getPlayerPosition(index, currentMatchRound.roundCount),
    }))

    return _players
  }, [match.players, currentMatchRound.roundCount])

  const [playersChecked, setPlayersChecked] = useState<
    Record<PlayerIndex, boolean>
  >({
    '0': false,
    '1': false,
    '2': false,
    '3': false,
  })

  const handleChangePlayersChecked = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget?.checked
      const playerIndex = e.currentTarget?.getAttribute(
        'data-player-index'
      ) as PlayerIndex

      if (typeof newValue === 'undefined' || !playerIndex) {
        return
      }

      setPlayersChecked((prev) => ({
        ...prev,
        [playerIndex]: newValue,
      }))
    },
    []
  )

  const title = useMemo(() => {
    return (
      <div>
        <MJMatchCounterSpan
          roundCount={currentMatchRound.roundCount}
          extendedRoundCount={currentMatchRound.extendedRoundCount}
          max={8}
        />
        <span> 流局</span>
      </div>
    )
  }, [currentMatchRound.roundCount, currentMatchRound.extendedRoundCount])

  const previewPlayerResults = useMemo(() => {
    const playerIndexes = Object.keys(
      currentMatchRound.playerResults
    ) as unknown as PlayerIndex[]

    const newPreviewPlayerResults: MatchRound['playerResults'] = {
      '0': {
        ...currentMatchRound.playerResults['0'],
        beforeScore: currentMatchRound.playerResults['0'].beforeScore,
        afterScore: currentMatchRound.playerResults['0'].beforeScore,
        type: 0,
        scoreChanges: [],
        prevScoreChanges:
          currentMatchRound.playerResults['0'].prevScoreChanges ?? [],
      },
      '1': {
        ...currentMatchRound.playerResults['1'],
        beforeScore: currentMatchRound.playerResults['1'].beforeScore,
        afterScore: currentMatchRound.playerResults['1'].beforeScore,
        type: 0,
        scoreChanges: [],
        prevScoreChanges:
          currentMatchRound.playerResults['1'].prevScoreChanges ?? [],
      },
      '2': {
        ...currentMatchRound.playerResults['2'],
        beforeScore: currentMatchRound.playerResults['2'].beforeScore,
        afterScore: currentMatchRound.playerResults['2'].beforeScore,
        type: 0,
        scoreChanges: [],
        prevScoreChanges:
          currentMatchRound.playerResults['2'].prevScoreChanges ?? [],
      },
      '3': {
        ...currentMatchRound.playerResults['3'],
        beforeScore: currentMatchRound.playerResults['3'].beforeScore,
        afterScore: currentMatchRound.playerResults['3'].beforeScore,
        type: 0,
        scoreChanges: [],
        prevScoreChanges:
          currentMatchRound.playerResults['3'].prevScoreChanges ?? [],
      },
    }

    let win = 0
    let lose = 0

    const numberOfWinners = Object.values(playersChecked).filter(
      (checked) => !!checked
    ).length

    if (numberOfWinners === 1) {
      win = 3000
      lose = 1000
    } else if (numberOfWinners === 2) {
      win = 1500
      lose = 1500
    } else if (numberOfWinners === 3) {
      win = 1000
      lose = 3000
    }

    for (let i = 0; i < playerIndexes.length; i += 1) {
      const currentPlayerIndex = playerIndexes[i]

      if (win && lose) {
        if (playersChecked[currentPlayerIndex]) {
          newPreviewPlayerResults[currentPlayerIndex].afterScore += win
          newPreviewPlayerResults[currentPlayerIndex].type =
            PlayerResultWinnerOrLoserEnum.Win
          newPreviewPlayerResults[currentPlayerIndex].scoreChanges = [win]
        } else {
          newPreviewPlayerResults[currentPlayerIndex].afterScore -= lose
          newPreviewPlayerResults[currentPlayerIndex].type =
            PlayerResultWinnerOrLoserEnum.Lose
          newPreviewPlayerResults[currentPlayerIndex].scoreChanges = [-lose]
        }
      }

      if (newPreviewPlayerResults[currentPlayerIndex].isRiichi) {
        newPreviewPlayerResults[currentPlayerIndex].afterScore -= 1000
        newPreviewPlayerResults[currentPlayerIndex].scoreChanges.unshift(-1000)
      }
    }

    return newPreviewPlayerResults
  }, [currentMatchRound.playerResults, playersChecked])

  const handleSubmit = useCallback(() => {
    if (!onSubmit) {
      return
    }

    const updatedMatchRound: MatchRound = {
      ...currentMatchRound,
      resultType: RoundResultTypeEnum.Exhausted,
      playerResults: previewPlayerResults,
      cumulatedThousands:
        currentMatchRound.cumulatedThousands +
        Object.values(previewPlayerResults).filter(({ isRiichi }) => !!isRiichi)
          .length,
    }

    onSubmit(updatedMatchRound)
  }, [currentMatchRound, onSubmit, previewPlayerResults])

  useEffect(() => {
    if (dialogProps.open) {
      // reset form
      setPlayersChecked({
        '0': false,
        '1': false,
        '2': false,
        '3': false,
      })
    }
  }, [dialogProps.open])

  return (
    <MJUIDialogV2 title={title} {...dialogProps}>
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-right text-xs text-gray-500">聽牌？</p>
          {players.map((player) => (
            <div key={player.index} className="flex">
              <div className="flex-1">{player.name}</div>
              <div className="shrink-0">
                <MJUISwitch
                  checked={playersChecked[player.index as PlayerIndex]}
                  onChange={handleChangePlayersChecked}
                  data-player-index={player.index}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h5 className="font-bold">分數變動</h5>

          <table className="text-sm w-full">
            <tbody>
              {(Object.keys(match.players) as unknown as PlayerIndex[]).map(
                (index) => (
                  <tr key={index}>
                    <th>{match.players[index].name}</th>
                    <td>{previewPlayerResults[index].beforeScore}</td>
                    <td>
                      <MJAmountSpan
                        signed
                        value={
                          previewPlayerResults[index].afterScore -
                          previewPlayerResults[index].beforeScore
                        }
                        positiveClassName="text-green-400"
                        negativeClassName="text-red-400"
                      />
                    </td>
                    <td className="text-right">
                      {previewPlayerResults[index].afterScore}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-2">
          <MJUIButton onClick={handleSubmit} className="w-full">
            提交並播出分數變動動畫
          </MJUIButton>
        </div>
      </div>
    </MJUIDialogV2>
  )
}
