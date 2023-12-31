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
} from '@/helpers/mahjong.helper'
import MJMatchCounterSpan from '../MJMatchCounterSpan'
import MJUISelect from '../MJUI/MJUISelect'
import MJHanFuScoreSpan from '../MJHanFuScoreSpan'
import MJAmountSpan from '../MJAmountSpan'
import MJYakuKeyboardDiv, {
  MJYakuKeyboardResult,
  MJYakuKeyboardResultDiv,
} from '../MJYakuKeyboardDiv'
import MJUIFormGroup from '../MJUI/MJUIFormGroup'

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
  const [yakuResult, setYakuResult] = useState<
    Omit<MJYakuKeyboardResult, 'raw'> & {
      raw: MJYakuKeyboardResult['raw'] | null
    }
  >({
    han: 1,
    fu: 30,
    yakumanCount: 0,
    dora: 0,
    redDora: 0,
    innerDora: 0,
    yakus: [],
    raw: {},
    isRevealed: false,
    isRiichied: false,
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

  const [activePlayerIndex, setActivePlayerIndex] = useState<string>(
    initialActivePlayerIndex ?? '0'
  )
  const activePlayer = useMemo(
    () =>
      typeof activePlayerIndex !== 'undefined'
        ? players?.find(({ index }) => index === activePlayerIndex)
        : undefined,
    [activePlayerIndex, players]
  )

  const [targetPlayerIndex, setTargetPlayerIndex] = useState<string | '-1'>(
    initialTargetPlayerIndex
  )

  const compiledScore = useMemo(() => {
    const newCompiledScore = getScoreInFullDetail(
      yakuResult.han,
      yakuResult.fu,
      yakuResult.yakumanCount,
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

    return newCompiledScore
  }, [
    yakuResult.han,
    yakuResult.fu,
    yakuResult.yakumanCount,
    activePlayer?.position,
    targetPlayerIndex,
    match.setting.isManganRoundUp,
    currentMatchRound.extendedRoundCount,
    currentMatchRound.cumulatedThousands,
  ])

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

  const isDaisangenTriggered = useMemo(
    () =>
      yakuResult.isRevealed &&
      yakuResult.yakus &&
      yakuResult.yakus.findIndex(({ id }) => id === 'daisangen') !== -1,
    [yakuResult.isRevealed, yakuResult.yakus]
  )
  const [
    yakumanDaisangenTriggerPlayerIndex,
    setYakumanDaisangenTriggerPlayerIndex,
  ] = useState<string | undefined>('-1')

  const isDaisuushiiTriggered = useMemo(
    () =>
      yakuResult.isRevealed &&
      yakuResult.yakus &&
      yakuResult.yakus.findIndex(({ id }) => id === 'daisuushii') !== -1,
    [yakuResult.isRevealed, yakuResult.yakus]
  )
  const [
    yakumanDaisuushiiTriggerPlayerIndex,
    setYakumanDaisuushiiTriggerPlayerIndex,
  ] = useState<string | undefined>('-1')

  const isSuukantsuTriggered = useMemo(
    () =>
      yakuResult.isRevealed &&
      yakuResult.yakus &&
      yakuResult.yakus.findIndex(({ id }) => id === 'suukantsu') !== -1,
    [yakuResult.isRevealed, yakuResult.yakus]
  )
  const [
    yakumanSuukantsuTriggerPlayerIndex,
    setYakumanSuukantsuTriggerPlayerIndex,
  ] = useState<string | undefined>('-1')

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
    }

    // eslint-disable-next-line no-extra-semi
    ;[
      {
        bool: isDaisangenTriggered,
        triggeredPlayerIndex: yakumanDaisangenTriggerPlayerIndex,
        yakuId: 'daisangen',
      },
      {
        bool: isDaisuushiiTriggered,
        triggeredPlayerIndex: yakumanDaisuushiiTriggerPlayerIndex,
        yakuId: 'daisuushii',
      },
      {
        bool: isSuukantsuTriggered,
        triggeredPlayerIndex: yakumanSuukantsuTriggerPlayerIndex,
        yakuId: 'suukantsu',
      },
    ].forEach(({ bool, triggeredPlayerIndex, yakuId }) => {
      if (
        bool &&
        triggeredPlayerIndex !== '-1' &&
        triggeredPlayerIndex !== activePlayerIndex &&
        triggeredPlayerIndex !== targetPlayerIndex
      ) {
        const yaku = yakuResult.yakus?.find(({ id }) => yakuId === id)
        if (yaku) {
          const yakuCompiledScore = getScoreInFullDetail(
            1,
            30,
            yaku.yakumanCount,
            getIsPlayerEast(
              activePlayerIndex as PlayerIndex,
              currentMatchRound.roundCount
            ),
            targetPlayerIndex !== '-1'
          )

          if (yakuCompiledScore.target) {
            const targetScore = Math.round(yakuCompiledScore.target / 2)

            newPreviewPlayerResults[
              targetPlayerIndex as PlayerIndex
            ].afterScore += targetScore
            newPreviewPlayerResults[
              targetPlayerIndex as PlayerIndex
            ].scoreChanges[0] += targetScore
            if (
              newPreviewPlayerResults[targetPlayerIndex as PlayerIndex]
                .scoreChanges[0] === 0
            ) {
              newPreviewPlayerResults[
                targetPlayerIndex as PlayerIndex
              ].scoreChanges.splice(0, 1)
            }

            newPreviewPlayerResults[
              triggeredPlayerIndex as PlayerIndex
            ].afterScore -= targetScore
            if (
              typeof newPreviewPlayerResults[
                triggeredPlayerIndex as PlayerIndex
              ].scoreChanges[0] === 'undefined'
            ) {
              newPreviewPlayerResults[
                triggeredPlayerIndex as PlayerIndex
              ].scoreChanges.push(-targetScore)
            } else {
              newPreviewPlayerResults[
                triggeredPlayerIndex as PlayerIndex
              ].scoreChanges[0] -= targetScore
            }
          } else if (yakuCompiledScore.all) {
            for (let i = 0; i < playerIndexes.length; i += 1) {
              const targetScore = yakuCompiledScore.all

              if (
                playerIndexes[i] !== activePlayerIndex &&
                playerIndexes[i] !== triggeredPlayerIndex
              ) {
                newPreviewPlayerResults[playerIndexes[i]].afterScore +=
                  targetScore
                newPreviewPlayerResults[playerIndexes[i]].scoreChanges[0] +=
                  targetScore
                if (
                  newPreviewPlayerResults[playerIndexes[i]].scoreChanges[0] ===
                  0
                ) {
                  newPreviewPlayerResults[playerIndexes[i]].scoreChanges.splice(
                    0,
                    1
                  )
                }

                newPreviewPlayerResults[
                  triggeredPlayerIndex as PlayerIndex
                ].afterScore -= targetScore
                if (
                  typeof newPreviewPlayerResults[
                    triggeredPlayerIndex as PlayerIndex
                  ].scoreChanges[0] === 'undefined'
                ) {
                  newPreviewPlayerResults[
                    triggeredPlayerIndex as PlayerIndex
                  ].scoreChanges.push(-targetScore)
                } else {
                  newPreviewPlayerResults[
                    triggeredPlayerIndex as PlayerIndex
                  ].scoreChanges[0] -= targetScore
                }
              }
            }
          } else if (yakuCompiledScore.east && yakuCompiledScore.others) {
            for (let i = 0; i < playerIndexes.length; i += 1) {
              if (
                playerIndexes[i] !== activePlayerIndex &&
                playerIndexes[i] !== triggeredPlayerIndex
              ) {
                const targetScore = getIsPlayerEast(
                  playerIndexes[i],
                  currentMatchRound.roundCount
                )
                  ? yakuCompiledScore.east
                  : yakuCompiledScore.others

                newPreviewPlayerResults[playerIndexes[i]].afterScore +=
                  targetScore
                newPreviewPlayerResults[playerIndexes[i]].scoreChanges[0] +=
                  targetScore
                if (
                  newPreviewPlayerResults[playerIndexes[i]].scoreChanges[0] ===
                  0
                ) {
                  newPreviewPlayerResults[playerIndexes[i]].scoreChanges.splice(
                    0,
                    1
                  )
                }

                newPreviewPlayerResults[
                  triggeredPlayerIndex as PlayerIndex
                ].afterScore -= targetScore
                if (
                  typeof newPreviewPlayerResults[
                    triggeredPlayerIndex as PlayerIndex
                  ].scoreChanges[0] === 'undefined'
                ) {
                  newPreviewPlayerResults[
                    triggeredPlayerIndex as PlayerIndex
                  ].scoreChanges.push(-targetScore)
                } else {
                  newPreviewPlayerResults[
                    triggeredPlayerIndex as PlayerIndex
                  ].scoreChanges[0] -= targetScore
                }
              }
            }
          }
        }
      }
    }, [])

    let activePlayerBonus = 0

    for (let i = 0; i < playerIndexes.length; i += 1) {
      const currentPlayerIndex = playerIndexes[i]
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
    currentMatchRound.playerResults,
    currentMatchRound.roundCount,
    isDaisangenTriggered,
    isDaisuushiiTriggered,
    isSuukantsuTriggered,
    targetPlayerIndex,
    yakuResult,
    yakumanDaisangenTriggerPlayerIndex,
    yakumanDaisuushiiTriggerPlayerIndex,
    yakumanSuukantsuTriggerPlayerIndex,
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
        yakus: yakuResult.yakus ?? [],
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
      setYakuResult(
        currentMatchRound.playerResults[initialActivePlayerIndex].detail
      )
      // setCompiledScore({
      //   win: 1000,
      //   target: 1000,
      // })
    }
  }, [
    currentMatchRound.playerResults,
    dialogProps.open,
    initialActivePlayerIndex,
    initialTargetPlayerIndex,
  ])

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
              activePlayerIndex={activePlayerIndex as PlayerIndex}
              targetPlayerIndex={targetPlayerIndex as PlayerIndex | '-1'}
              onChange={setYakuResult}
              value={
                currentMatchRound.playerResults[
                  activePlayerIndex as PlayerIndex
                ].detail
              }
            />

            <MJYakuKeyboardResultDiv
              result={yakuResult}
              matchSetting={match.setting}
            />

            <div className="text-3xl font-bold text-center bg-teal-400 py-2">
              <MJHanFuScoreSpan score={compiledScore} />
            </div>
          </div>
        </div>

        {(isDaisangenTriggered ||
          isDaisuushiiTriggered ||
          isSuukantsuTriggered) && (
          <div className="space-y-2 bg-yellow-200 p-4">
            <h5 className="font-bold">包牌</h5>
            <p>
              當某家打出的牌被鳴牌後，導致役滿確定時（大三元、大四喜、四槓子），便會觸發「包牌」。
              <br />- 如自摸，包牌者需支付該役種全部點數
              <br />- 如他家放銃，包牌者需支付該役種一半點數
            </p>

            <div className="grid grid-cols-2 gap-6">
              {isDaisangenTriggered && (
                <MJUIFormGroup label="大三元包牌者">
                  <MJUISelect
                    value={yakumanDaisangenTriggerPlayerIndex}
                    onChangeValue={setYakumanDaisangenTriggerPlayerIndex}
                  >
                    <option value="-1">沒有包牌</option>
                    {players.map(({ index, name }) => (
                      <option key={index} value={index}>
                        {name}
                      </option>
                    ))}
                  </MJUISelect>
                </MJUIFormGroup>
              )}

              {isDaisuushiiTriggered && (
                <MJUIFormGroup label="大四喜包牌者">
                  <MJUISelect
                    value={yakumanDaisuushiiTriggerPlayerIndex}
                    onChangeValue={setYakumanDaisuushiiTriggerPlayerIndex}
                  >
                    <option value="-1">沒有包牌</option>
                    {players.map(({ index, name }) => (
                      <option key={index} value={index}>
                        {name}
                      </option>
                    ))}
                  </MJUISelect>
                </MJUIFormGroup>
              )}

              {isSuukantsuTriggered && (
                <MJUIFormGroup label="四槓子包牌者">
                  <MJUISelect
                    value={yakumanSuukantsuTriggerPlayerIndex}
                    onChangeValue={setYakumanSuukantsuTriggerPlayerIndex}
                  >
                    <option value="-1">沒有包牌</option>
                    {players.map(({ index, name }) => (
                      <option key={index} value={index}>
                        {name}
                      </option>
                    ))}
                  </MJUISelect>
                </MJUIFormGroup>
              )}
            </div>
          </div>
        )}

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
            disabled={!yakuResult?.yakus || yakuResult.yakus.length <= 0}
          >
            <i className="bi bi-camera-reels-fill"></i> 提交並播出分數變動動畫
          </MJUIButton>
        </div>
      </div>
    </MJUIDialogV2>
  )
}
