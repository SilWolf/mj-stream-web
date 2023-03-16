import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import MJUIDialog from '@/components/MJUI/MJUIDialog'
import MJUIButton from '@/components/MJUI/MJUIButton'
import { MatchRound, PlayerIndex, PlayerPositionEnum } from '@/models'
import { MatchDTO } from '@/hooks/useMatch'
import {
  getIsPlayerEast,
  getPlayerPosition,
  MJCompiledScore,
} from '@/helpers/mahjong.helper'
import MJHanFuScoreSelect from '@/components/MJHanFuScoreSelect'
import MJMatchCounterSpan from '../MJMatchCounterSpan'
import MJUISelect from '../MJUI/MJUISelect'
import MJHanFuScoreSpan from '../MJHanFuScoreSpan'

type Props = {
  open: boolean
  match: MatchDTO
  matchRound: MatchRound
  initialActivePlayer?: string
  initialTargetPlayer?: string
}

export default function MJMatchRonDialog({
  open,
  match,
  matchRound,
  initialActivePlayer = '0',
  initialTargetPlayer = '-1',
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
      position: getPlayerPosition(index, matchRound.roundCount),
    }))

    return _players
  }, [match.players, matchRound.roundCount])

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
          roundCount={matchRound.roundCount}
          subRoundCount={matchRound.subRoundCount}
        />
        <span> 和了</span>
      </div>
    )
  }, [matchRound.roundCount, matchRound.subRoundCount])

  const previewPlayerResults = useMemo(() => {
    const playerIndexes = Object.keys(
      matchRound.playerResults
    ) as unknown as PlayerIndex[]

    const newPreviewPlayerResults: MatchRound['playerResults'] = {
      '0': {
        beforeScore: matchRound.playerResults['0'].afterScore,
        afterScore: matchRound.playerResults['0'].afterScore,
        type: 0,
      },
      '1': {
        beforeScore: matchRound.playerResults['1'].afterScore,
        afterScore: matchRound.playerResults['1'].afterScore,
        type: 0,
      },
      '2': {
        beforeScore: matchRound.playerResults['2'].afterScore,
        afterScore: matchRound.playerResults['2'].afterScore,
        type: 0,
      },
      '3': {
        beforeScore: matchRound.playerResults['3'].afterScore,
        afterScore: matchRound.playerResults['3'].afterScore,
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
      } else if (
        compiledScore.target &&
        currentPlayerIndex === targetPlayerIndex
      ) {
        newPreviewPlayerResults[currentPlayerIndex].afterScore -=
          compiledScore.target
      } else if (compiledScore.all) {
        newPreviewPlayerResults[currentPlayerIndex].afterScore -=
          compiledScore.all
      } else if (compiledScore.east && compiledScore.others) {
        if (getIsPlayerEast(currentPlayerIndex, matchRound.roundCount)) {
          newPreviewPlayerResults[currentPlayerIndex].afterScore -=
            compiledScore.east
        } else {
          newPreviewPlayerResults[currentPlayerIndex].afterScore -=
            compiledScore.others
        }
      }
    }

    console.log(newPreviewPlayerResults)

    return newPreviewPlayerResults
  }, [
    activePlayerIndex,
    compiledScore.all,
    compiledScore.east,
    compiledScore.others,
    compiledScore.target,
    compiledScore.win,
    matchRound,
    targetPlayerIndex,
  ])

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

          <MJUIButton className="w-full" disabled={!isConfirm}>
            提交並播出分數變動動畫
          </MJUIButton>
        </div>
      </div>
    </MJUIDialog>
  )
}
