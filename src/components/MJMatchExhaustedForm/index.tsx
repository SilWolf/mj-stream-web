import React, { useCallback, useEffect, useMemo, useState } from 'react'
import MJUIButton from '@/components/MJUI/MJUIButton'
import {
  RealtimeMatch,
  RealtimeMatchRound,
  PlayerIndex,
  PlayerResultWinnerOrLoserEnum,
  RoundResultTypeEnum,
} from '@/models'
import MJUISwitch from '../MJUI/MJUISwitch'
import MJAmountSpan from '../MJAmountSpan'

export type MJMatchExhaustedFormProps = {
  rtMatch: RealtimeMatch
  currentMatchRound: RealtimeMatchRound
  submitNode?: React.ReactNode
  onSubmit?: (resultMatchRound: RealtimeMatchRound) => unknown
}

export default function MJMatchExhaustedForm({
  rtMatch,
  currentMatchRound,
  submitNode = (
    <span>
      <i className="bi bi-camera-reels-fill"></i> 提交並播出分數變動動畫
    </span>
  ),
  onSubmit,
}: MJMatchExhaustedFormProps) {
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

  const previewPlayerResults = useMemo(() => {
    const playerIndexes = Object.keys(
      currentMatchRound.playerResults
    ) as unknown as PlayerIndex[]

    const newPreviewPlayerResults: RealtimeMatchRound['playerResults'] = {
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

    const numberOfWinners = (['0', '1', '2', '3'] as PlayerIndex[]).filter(
      (playerIndex) =>
        playersChecked[playerIndex] &&
        !currentMatchRound.playerResults[playerIndex].isRonDisallowed
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
      newPreviewPlayerResults[currentPlayerIndex].type = playersChecked[
        currentPlayerIndex
      ]
        ? PlayerResultWinnerOrLoserEnum.Win
        : PlayerResultWinnerOrLoserEnum.Lose

      if (win && lose) {
        if (playersChecked[currentPlayerIndex]) {
          if (
            currentMatchRound.playerResults[currentPlayerIndex].isRonDisallowed
          ) {
            newPreviewPlayerResults[currentPlayerIndex].afterScore -= lose
            newPreviewPlayerResults[currentPlayerIndex].scoreChanges = [-lose]
          } else {
            newPreviewPlayerResults[currentPlayerIndex].afterScore += win
            newPreviewPlayerResults[currentPlayerIndex].scoreChanges = [win]
          }
        } else {
          newPreviewPlayerResults[currentPlayerIndex].afterScore -= lose
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

    const updatedMatchRound: RealtimeMatchRound = {
      ...currentMatchRound,
      resultType: RoundResultTypeEnum.Exhausted,
      playerResults: previewPlayerResults,
      nextRoundCumulatedThousands:
        currentMatchRound.cumulatedThousands +
        Object.values(previewPlayerResults).filter(({ isRiichi }) => !!isRiichi)
          .length,
    }

    onSubmit(updatedMatchRound)
  }, [currentMatchRound, onSubmit, previewPlayerResults])

  useEffect(() => {
    // reset form
    setPlayersChecked({
      '0':
        !!currentMatchRound.playerResults['0'].waitingTiles &&
        currentMatchRound.playerResults['0'].waitingTiles?.length > 0,
      '1':
        !!currentMatchRound.playerResults['1'].waitingTiles &&
        currentMatchRound.playerResults['1'].waitingTiles?.length > 0,
      '2':
        !!currentMatchRound.playerResults['2'].waitingTiles &&
        currentMatchRound.playerResults['2'].waitingTiles?.length > 0,
      '3':
        !!currentMatchRound.playerResults['3'].waitingTiles &&
        currentMatchRound.playerResults['3'].waitingTiles?.length > 0,
    })
  }, [currentMatchRound.playerResults])

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h5 className="font-bold">分數變動</h5>

        <table className="data-table w-full text-lg">
          <thead>
            <tr>
              <th>玩家</th>
              <th className="bg-yellow-200!">聽牌？</th>
              <th className="w-32">目前分數</th>
              <th className="w-32">變動</th>
              <th className="w-32">最新分數</th>
            </tr>
          </thead>
          <tbody>
            {(Object.keys(rtMatch.players) as unknown as PlayerIndex[]).map(
              (index) => (
                <tr key={index}>
                  <th
                    className="text-white py-1"
                    style={{ background: rtMatch.players[index].color }}
                  >
                    {rtMatch.players[index].primaryName}
                  </th>
                  <td
                    className="text-center bg-yellow-200"
                    style={{
                      backgroundColor: currentMatchRound.playerResults[index]
                        .isRonDisallowed
                        ? '#F00'
                        : '',
                    }}
                  >
                    <MJUISwitch
                      checked={playersChecked[index]}
                      onChange={handleChangePlayersChecked}
                      data-player-index={index}
                    />
                    {currentMatchRound.playerResults[index].isRonDisallowed && (
                      <p className="text-white text-sm font-semibold">
                        和了禁止
                      </p>
                    )}
                  </td>
                  <td className="text-center">
                    {previewPlayerResults[index].beforeScore}
                  </td>
                  <td className="text-center">
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
                  <td className="text-center">
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
          {submitNode}
        </MJUIButton>
      </div>
    </div>
  )
}
