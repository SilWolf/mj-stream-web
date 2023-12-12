import React, { useCallback, useEffect, useMemo, useState } from 'react'
import MJUIDialogV2, { MJUIDialogV2Props } from '@/components/MJUI/MJUIDialogV2'
import MJUIButton from '@/components/MJUI/MJUIButton'
import {
  Match,
  MatchRound,
  PlayerIndex,
  PlayerPositionEnum,
  PlayerResultWinnerOrLoserEnum,
} from '@/models'
import {
  getIsPlayerEast,
  getPlayerPosition,
  getRoundResultTypeByCompiledScore,
  getScoreInFullDetail,
  MJCompiledScore,
} from '@/helpers/mahjong.helper'
import MJMatchCounterSpan from '../MJMatchCounterSpan'
import MJUISelect from '../MJUI/MJUISelect'
import MJHanFuScoreSpan from '../MJHanFuScoreSpan'
import MJAmountSpan from '../MJAmountSpan'
import MJYakuKeyboardDiv from '../MJYakuKeyboardDiv'

export type MJMatchRonProps = Pick<MJUIDialogV2Props, 'open' | 'onClose'> & {
  match: Match
  currentMatchRound: MatchRound
  initialActivePlayerIndex?: PlayerIndex
  initialTargetPlayerIndex?: PlayerIndex | '-1'
  onSubmit?: (resultMatchRound: MatchRound) => unknown
}

export default function MJMatchRonDialog({
  match,
  currentMatchRound,
  initialActivePlayerIndex = '0',
  initialTargetPlayerIndex = '-1',
  onSubmit,
  ...dialogProps
}: MJMatchRonProps) {
  const [yakuResult, setYakuResult] = useState<{
    han: number
    fu: number
    yakusInText: string[]
    isYakuman: boolean
  }>()
  const [compiledScore, setCompiledScore] = useState<MJCompiledScore>({
    win: 1000,
    target: 1000,
  })

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

  const [activePlayerIndex, setActivePlayerIndex] = useState<
    string | undefined
  >(initialActivePlayerIndex)
  const activePlayer = useMemo(
    () =>
      typeof activePlayerIndex !== 'undefined'
        ? players?.find(({ index }) => index === activePlayerIndex)
        : undefined,
    [activePlayerIndex, players]
  )

  const [targetPlayerIndex, setTargetPlayerIndex] = useState<
    string | undefined
  >(initialTargetPlayerIndex)

  const handleChangeYaku = useCallback(
    (result: {
      han: number
      fu: number
      yakusInText: string[]
      isYakuman: boolean
    }) => {
      const newCompiledScore = getScoreInFullDetail(
        Math.min(result.han, result.isYakuman ? 13 : 12),
        result.fu,
        activePlayer?.position === PlayerPositionEnum.East,
        targetPlayerIndex !== '-1',
        { roundUp: match.setting.isManganRoundUp === '1' }
      )

      if (currentMatchRound.extendedRoundCount > 0) {
        newCompiledScore.win += currentMatchRound.extendedRoundCount * 300

        if (newCompiledScore.target) {
          newCompiledScore.target += currentMatchRound.extendedRoundCount * 300
        }
        if (newCompiledScore.all) {
          newCompiledScore.all += currentMatchRound.extendedRoundCount * 100
        }
        if (newCompiledScore.east) {
          newCompiledScore.east += currentMatchRound.extendedRoundCount * 100
        }
        if (newCompiledScore.others) {
          newCompiledScore.others += currentMatchRound.extendedRoundCount * 100
        }
      }

      if (currentMatchRound.cumulatedThousands > 0) {
        newCompiledScore.win += currentMatchRound.cumulatedThousands * 1000
      }

      setYakuResult(result)
      setCompiledScore(newCompiledScore)
    },
    [
      activePlayer?.position,
      targetPlayerIndex,
      match.setting.isManganRoundUp,
      currentMatchRound.extendedRoundCount,
      currentMatchRound.cumulatedThousands,
    ]
  )

  const title = useMemo(() => {
    return (
      <div>
        <MJMatchCounterSpan
          roundCount={currentMatchRound.roundCount}
          extendedRoundCount={currentMatchRound.extendedRoundCount}
          max={8}
        />
        <span> 和了</span>
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
          currentMatchRound.playerResults['0'].scoreChanges ?? [],
      },
      '1': {
        ...currentMatchRound.playerResults['1'],
        beforeScore: currentMatchRound.playerResults['1'].beforeScore,
        afterScore: currentMatchRound.playerResults['1'].beforeScore,
        type: 0,
        scoreChanges: [],
        prevScoreChanges:
          currentMatchRound.playerResults['1'].scoreChanges ?? [],
      },
      '2': {
        ...currentMatchRound.playerResults['2'],
        beforeScore: currentMatchRound.playerResults['2'].beforeScore,
        afterScore: currentMatchRound.playerResults['2'].beforeScore,
        type: 0,
        scoreChanges: [],
        prevScoreChanges:
          currentMatchRound.playerResults['2'].scoreChanges ?? [],
      },
      '3': {
        ...currentMatchRound.playerResults['3'],
        beforeScore: currentMatchRound.playerResults['3'].beforeScore,
        afterScore: currentMatchRound.playerResults['3'].beforeScore,
        type: 0,
        scoreChanges: [],
        prevScoreChanges:
          currentMatchRound.playerResults['3'].scoreChanges ?? [],
      },
    }

    if (activePlayerIndex === targetPlayerIndex) {
      return newPreviewPlayerResults
    }

    let activePlayerBonus = 0

    for (let i = 0; i < playerIndexes.length; i += 1) {
      const currentPlayerIndex = playerIndexes[i]

      if (currentPlayerIndex === activePlayerIndex) {
        newPreviewPlayerResults[currentPlayerIndex].afterScore +=
          compiledScore.win
        newPreviewPlayerResults[currentPlayerIndex].type =
          PlayerResultWinnerOrLoserEnum.Win
        newPreviewPlayerResults[currentPlayerIndex].scoreChanges = [
          compiledScore.win,
        ]
      } else if (
        compiledScore.target &&
        currentPlayerIndex === targetPlayerIndex
      ) {
        newPreviewPlayerResults[currentPlayerIndex].afterScore -=
          compiledScore.target
        newPreviewPlayerResults[currentPlayerIndex].type =
          PlayerResultWinnerOrLoserEnum.Lose
        newPreviewPlayerResults[currentPlayerIndex].scoreChanges = [
          -compiledScore.target,
        ]
      } else if (compiledScore.all) {
        newPreviewPlayerResults[currentPlayerIndex].afterScore -=
          compiledScore.all
        newPreviewPlayerResults[currentPlayerIndex].type =
          PlayerResultWinnerOrLoserEnum.Lose
        newPreviewPlayerResults[currentPlayerIndex].scoreChanges = [
          -compiledScore.all,
        ]
      } else if (compiledScore.east && compiledScore.others) {
        if (getIsPlayerEast(currentPlayerIndex, currentMatchRound.roundCount)) {
          newPreviewPlayerResults[currentPlayerIndex].afterScore -=
            compiledScore.east
          newPreviewPlayerResults[currentPlayerIndex].type =
            PlayerResultWinnerOrLoserEnum.Lose
          newPreviewPlayerResults[currentPlayerIndex].scoreChanges = [
            -compiledScore.east,
          ]
        } else {
          newPreviewPlayerResults[currentPlayerIndex].afterScore -=
            compiledScore.others
          newPreviewPlayerResults[currentPlayerIndex].type =
            PlayerResultWinnerOrLoserEnum.Lose
          newPreviewPlayerResults[currentPlayerIndex].scoreChanges = [
            -compiledScore.others,
          ]
        }
      }

      if (
        currentPlayerIndex !== activePlayerIndex &&
        newPreviewPlayerResults[currentPlayerIndex].isRiichi
      ) {
        newPreviewPlayerResults[currentPlayerIndex].afterScore -= 1000
        newPreviewPlayerResults[currentPlayerIndex].scoreChanges.unshift(-1000)

        activePlayerBonus += 1000
      }
    }

    if (activePlayerIndex && activePlayerBonus > 0) {
      newPreviewPlayerResults[activePlayerIndex as PlayerIndex].afterScore +=
        activePlayerBonus
      newPreviewPlayerResults[
        activePlayerIndex as PlayerIndex
      ].scoreChanges.unshift(activePlayerBonus)
    }

    newPreviewPlayerResults[activePlayerIndex as PlayerIndex].detail =
      yakuResult

    return newPreviewPlayerResults
  }, [
    activePlayerIndex,
    compiledScore.all,
    compiledScore.east,
    compiledScore.others,
    compiledScore.target,
    compiledScore.win,
    currentMatchRound,
    targetPlayerIndex,
    yakuResult,
  ])

  const handleSubmit = useCallback(() => {
    if (!onSubmit || !yakuResult) {
      return
    }

    const updatedMatchRound: MatchRound = {
      ...currentMatchRound,
      resultType: getRoundResultTypeByCompiledScore(compiledScore),
      playerResults: previewPlayerResults,
      nextRoundCumulatedThousands: 0,
      resultDetail: {
        winnerPlayerIndex: activePlayerIndex as PlayerIndex,
        ...yakuResult,
      },
    }

    onSubmit(updatedMatchRound)
  }, [
    activePlayerIndex,
    compiledScore,
    currentMatchRound,
    onSubmit,
    previewPlayerResults,
    yakuResult,
  ])

  useEffect(() => {
    if (dialogProps.open) {
      // reset form
      setActivePlayerIndex(initialActivePlayerIndex)
      setTargetPlayerIndex(initialTargetPlayerIndex)
      // setYakuResult({
      //   han: 1,
      //   fu: 30,
      //   yakusInText: [],
      //   isYakuman: false,
      // })
      // setCompiledScore({
      //   win: 1000,
      //   target: 1000,
      // })
    }
  }, [dialogProps.open, initialActivePlayerIndex, initialTargetPlayerIndex])

  return (
    <MJUIDialogV2 title={title} {...dialogProps}>
      <div className="space-y-8">
        <div className="flex gap-x-4 items-center">
          <div className="flex-1">
            <MJUISelect
              value={activePlayerIndex}
              onChangeValue={setActivePlayerIndex}
            >
              {players.map(({ index, name }) => (
                <option key={index} value={index}>
                  {name}
                </option>
              ))}
            </MJUISelect>
          </div>
          <div className="text-xs text-gray-500">和了</div>
          <div className="flex-1">
            <MJUISelect
              value={targetPlayerIndex}
              onChangeValue={setTargetPlayerIndex}
            >
              <option value="-1">自摸</option>
              {players.map(({ index, name }) => (
                <option key={index} value={index}>
                  {name}
                </option>
              ))}
            </MJUISelect>
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="font-bold">役種</h5>
          <div>
            <MJYakuKeyboardDiv
              round={currentMatchRound.roundCount}
              activePlayerIndex={initialActivePlayerIndex}
              isEast={activePlayer?.position === PlayerPositionEnum.East}
              isRon={targetPlayerIndex !== '-1'}
              onChange={handleChangeYaku}
              setting={match.setting}
            />

            <div className="text-3xl font-bold text-center bg-teal-400 py-2">
              <MJHanFuScoreSpan score={compiledScore} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="font-bold">分數變動</h5>

          <table className="data-table w-full text-lg">
            <thead>
              <tr>
                <th>玩家</th>
                <th>目前分數</th>
                <th>變動</th>
                <th>最新分數</th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(match.players) as unknown as PlayerIndex[]).map(
                (index) => (
                  <tr key={index}>
                    <th
                      className="text-white py-1"
                      style={{ background: match.players[index].color }}
                    >
                      {match.players[index].name}
                    </th>
                    <td className="px-2 text-center w-32">
                      {previewPlayerResults[index].beforeScore}
                    </td>
                    <td className="text-center w-32">
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
                    <td className="text-center w-32">
                      {previewPlayerResults[index].afterScore}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-2">
          <MJUIButton
            onClick={handleSubmit}
            className="w-full"
            disabled={!yakuResult || yakuResult.yakusInText.length <= 0}
          >
            <i className="bi bi-camera-reels-fill"></i> 提交並播出分數變動動畫
          </MJUIButton>
        </div>
      </div>
    </MJUIDialogV2>
  )
}
