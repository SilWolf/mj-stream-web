import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import MJUIDialog from '@/components/MJUI/MJUIDialog'
import MJUIButton from '@/components/MJUI/MJUIButton'
import {
  MatchRound,
  PlayerIndex,
  PlayerPositionEnum,
  PlayerResultWinnerOrLoserEnum,
} from '@/models'
import { MatchDTO } from '@/hooks/useMatch'
import {
  getIsPlayerEast,
  getPlayerPosition,
  getRoundResultTypeByCompiledScore,
  MJCompiledScore,
} from '@/helpers/mahjong.helper'
import MJHanFuScoreSelect from '@/components/MJHanFuScoreSelect'
import MJMatchCounterSpan from '../MJMatchCounterSpan'
import MJUISelect from '../MJUI/MJUISelect'
import MJHanFuScoreSpan from '../MJHanFuScoreSpan'

type Props = {
  open: boolean
  match: MatchDTO
  currentMatchRound: MatchRound
  initialActivePlayer?: string
  initialTargetPlayer?: string
  onSubmit?: (resultMatchRound: MatchRound) => unknown
}

export default function MJMatchRonDialog({
  open,
  match,
  currentMatchRound,
  initialActivePlayer = '0',
  initialTargetPlayer = '-1',
  onSubmit,
}: Props) {
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

  const [isConfirm, setIsConfirm] = useState<boolean>(false)
  const [activePlayerIndex, setActivePlayerIndex] = useState<
    string | undefined
  >(initialActivePlayer)
  const activePlayer = useMemo(
    () =>
      typeof activePlayerIndex !== 'undefined'
        ? players?.find(({ index }) => index === activePlayerIndex)
        : undefined,
    [activePlayerIndex, players]
  )

  const [targetPlayerIndex, setTargetPlayerIndex] = useState<
    string | undefined
  >(initialTargetPlayer)
  const targetPlayer = useMemo(
    () =>
      typeof targetPlayerIndex !== 'undefined'
        ? players?.find(({ index }) => index === targetPlayerIndex)
        : undefined,
    [targetPlayerIndex, players]
  )

  const handleChangeIsConfirm = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setIsConfirm(e.currentTarget.checked)
    },
    []
  )

  const title = useMemo(() => {
    return (
      <div>
        <MJMatchCounterSpan
          roundCount={currentMatchRound.roundCount}
          extendedRoundCount={currentMatchRound.extendedRoundCount}
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
        beforeScore: currentMatchRound.playerResults['0'].afterScore,
        afterScore: currentMatchRound.playerResults['0'].afterScore,
        type: 0,
      },
      '1': {
        beforeScore: currentMatchRound.playerResults['1'].afterScore,
        afterScore: currentMatchRound.playerResults['1'].afterScore,
        type: 0,
      },
      '2': {
        beforeScore: currentMatchRound.playerResults['2'].afterScore,
        afterScore: currentMatchRound.playerResults['2'].afterScore,
        type: 0,
      },
      '3': {
        beforeScore: currentMatchRound.playerResults['3'].afterScore,
        afterScore: currentMatchRound.playerResults['3'].afterScore,
        type: 0,
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
      } else if (
        compiledScore.target &&
        currentPlayerIndex === targetPlayerIndex
      ) {
        newPreviewPlayerResults[currentPlayerIndex].afterScore -=
          compiledScore.target
        newPreviewPlayerResults[currentPlayerIndex].type =
          PlayerResultWinnerOrLoserEnum.Lose
      } else if (compiledScore.all) {
        newPreviewPlayerResults[currentPlayerIndex].afterScore -=
          compiledScore.all
        newPreviewPlayerResults[currentPlayerIndex].type =
          PlayerResultWinnerOrLoserEnum.Lose
      } else if (compiledScore.east && compiledScore.others) {
        if (getIsPlayerEast(currentPlayerIndex, currentMatchRound.roundCount)) {
          newPreviewPlayerResults[currentPlayerIndex].afterScore -=
            compiledScore.east
          newPreviewPlayerResults[currentPlayerIndex].type =
            PlayerResultWinnerOrLoserEnum.Lose
        } else {
          newPreviewPlayerResults[currentPlayerIndex].afterScore -=
            compiledScore.others
          newPreviewPlayerResults[currentPlayerIndex].type =
            PlayerResultWinnerOrLoserEnum.Lose
        }
      }
    }

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
  ])

  const handleSubmit = useCallback(() => {
    if (!onSubmit) {
      return
    }

    const updatedMatchRound: MatchRound = {
      ...currentMatchRound,
      resultType: getRoundResultTypeByCompiledScore(compiledScore),
      playerResults: previewPlayerResults,
    }

    onSubmit(updatedMatchRound)
  }, [compiledScore, currentMatchRound, onSubmit, previewPlayerResults])

  return (
    <MJUIDialog title={title} open={open}>
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

        <MJHanFuScoreSelect
          isEast={activePlayer?.position === PlayerPositionEnum.East}
          isRon={targetPlayerIndex !== '-1'}
          onChangeScore={setCompiledScore}
        />

        <div className="text-2xl font-bold text-center bg-gray-600 text-white py-2">
          <MJHanFuScoreSpan score={compiledScore} />
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
                      {previewPlayerResults[index].afterScore -
                        previewPlayerResults[index].beforeScore}
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
          <div>
            <label htmlFor="isConfirm">
              <input
                id="isConfirm"
                type="checkbox"
                checked={isConfirm}
                onChange={handleChangeIsConfirm}
              />
              我已確認上述分數變動正確無誤
            </label>
          </div>

          <MJUIButton
            onClick={handleSubmit}
            className="w-full"
            disabled={!isConfirm}
          >
            提交並播出分數變動動畫
          </MJUIButton>
        </div>
      </div>
    </MJUIDialog>
  )
}
