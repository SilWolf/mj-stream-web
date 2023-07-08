import React, { useEffect, useMemo } from 'react'
import MJUIDialogV2, { MJUIDialogV2Props } from '@/components/MJUI/MJUIDialogV2'
import MJUIButton from '@/components/MJUI/MJUIButton'
import { MatchRound, PlayerIndex, RoundResultTypeEnum } from '@/models'
import { MatchDTO } from '@/hooks/useMatch'
import { getPlayerPosition } from '@/helpers/mahjong.helper'
import { Controller, useForm } from 'react-hook-form'
import MJPlayerInfoCardDiv from '../MJPlayerInfoCardDiv'
import MJUIInput from '../MJUI/MJUIInput'

export type MJMatchRonProps = Pick<MJUIDialogV2Props, 'open' | 'onClose'> & {
  match: MatchDTO
  currentMatchRound: MatchRound
  onSubmit?: (resultMatchRound: MatchRound) => unknown
}

export default function MJMatchHotfixDialog({
  match,
  currentMatchRound,
  onSubmit,
  ...dialogProps
}: MJMatchRonProps) {
  const {
    reset: resetForm,
    handleSubmit,
    control: formControl,
  } = useForm({
    defaultValues: {
      player_0: 0,
      player_1: 0,
      player_2: 0,
      player_3: 0,
      cumulatedThousands: 0,
      roundCount: 0,
      extendedRoundCount: 0,
    },
  })

  const players = useMemo(() => {
    const _players = (
      Object.keys(match.players) as unknown as PlayerIndex[]
    ).map((index) => ({
      ...match.players[index],
      index: index.toString(),
      position: getPlayerPosition(index, currentMatchRound.roundCount),
    }))

    return _players
  }, [match.players, currentMatchRound.roundCount])

  const handleSubmitForm = useMemo(
    () =>
      handleSubmit((data) => {
        if (!onSubmit) {
          return
        }

        const updatedMatchRound: MatchRound = {
          ...currentMatchRound,
          resultType: RoundResultTypeEnum.Hotfix,
          playerResults: {
            '0': {
              ...currentMatchRound.playerResults[0],
              afterScore: data.player_0,
            },
            '1': {
              ...currentMatchRound.playerResults[1],
              afterScore: data.player_1,
            },
            '2': {
              ...currentMatchRound.playerResults[2],
              afterScore: data.player_2,
            },
            '3': {
              ...currentMatchRound.playerResults[3],
              afterScore: data.player_3,
            },
          },
        }

        onSubmit(updatedMatchRound)
      }),
    [currentMatchRound, handleSubmit, onSubmit]
  )

  useEffect(() => {
    if (dialogProps.open) {
      // reset form
      resetForm({
        player_0: currentMatchRound.playerResults['0'].beforeScore,
        player_1: currentMatchRound.playerResults['1'].beforeScore,
        player_2: currentMatchRound.playerResults['2'].beforeScore,
        player_3: currentMatchRound.playerResults['3'].beforeScore,
        cumulatedThousands: currentMatchRound.cumulatedThousands,
        roundCount: currentMatchRound.roundCount,
        extendedRoundCount: currentMatchRound.extendedRoundCount,
      })
    }
  }, [
    currentMatchRound.cumulatedThousands,
    currentMatchRound.extendedRoundCount,
    currentMatchRound.playerResults,
    currentMatchRound.roundCount,
    dialogProps.open,
    resetForm,
  ])

  return (
    <MJUIDialogV2 title="手動調整分數" {...dialogProps}>
      <div className="space-y-8">
        <div className="space-y-2">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-1/2">玩家</th>
                <th className="w-1/4">現在分數</th>
                <th className="w-1/4">新的分數</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.index}>
                  <td className="px-2 border border-gray-200 align-middle">
                    <MJPlayerInfoCardDiv player={player} />
                  </td>
                  <td className="text-center px-2 border border-gray-200 align-middle">
                    {
                      currentMatchRound.playerResults[
                        player.index as PlayerIndex
                      ].beforeScore
                    }
                  </td>
                  <td className="px-2 border border-gray-200 align-middle">
                    <Controller
                      name={`player_${player.index as PlayerIndex}`}
                      control={formControl}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <MJUIInput
                          className="text-center"
                          type="number"
                          {...field}
                        />
                      )}
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-2 border border-gray-200 align-middle">
                  供托
                </td>
                <td className="text-center px-2 border border-gray-200 align-middle">
                  {currentMatchRound.cumulatedThousands}
                </td>
                <td className="px-2 border border-gray-200 align-middle">
                  <Controller
                    name="cumulatedThousands"
                    control={formControl}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <MJUIInput
                        className="text-center"
                        type="number"
                        {...field}
                      />
                    )}
                  />
                </td>
              </tr>
              <tr>
                <td className="px-2 border border-gray-200 align-middle">
                  局數(東1局=1, 東2局=2, ...)
                </td>
                <td className="text-center px-2 border border-gray-200 align-middle">
                  {currentMatchRound.roundCount}
                </td>
                <td className="px-2 border border-gray-200 align-middle">
                  <Controller
                    name="roundCount"
                    control={formControl}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <MJUIInput
                        className="text-center"
                        type="number"
                        {...field}
                      />
                    )}
                  />
                </td>
              </tr>
              <tr>
                <td className="px-2 border border-gray-200 align-middle">
                  本場數
                </td>
                <td className="text-center px-2 border border-gray-200 align-middle">
                  {currentMatchRound.roundCount}
                </td>
                <td className="px-2 border border-gray-200 align-middle">
                  <Controller
                    name="extendedRoundCount"
                    control={formControl}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <MJUIInput
                        className="text-center"
                        type="number"
                        {...field}
                      />
                    )}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-2">
          <MJUIButton onClick={handleSubmitForm} className="w-full">
            提交並更新直播畫面
          </MJUIButton>
        </div>
      </div>
    </MJUIDialogV2>
  )
}
