import MJPositionSpan from '@/components/MJPositionSpan'
import { Match, MatchRound, MatchSetting, Player, PlayerIndex } from '@/models'
import React, { MouseEvent, useCallback, useState } from 'react'
import { useFirebaseDatabase } from '@/providers/firebaseDatabase.provider'
import {
  generateMatchCode,
  generateMatchRoundCode,
} from '@/helpers/mahjong.helper'
import { useLocation } from 'wouter'
import { useAsyncFn, useBoolean } from 'react-use'
import MJUIButton from '@/components/MJUI/MJUIButton'
import MJPlayerCardDiv from '@/components/MJPlayerCardDiv'
import MJUIDialogV2 from '@/components/MJUI/MJUIDialogV2'
import MJPlayerForm from '@/components/MJPlayerForm'
import MJUIFormGroup from '@/components/MJUI/MJUIFormGroup'
import MJUIInput from '@/components/MJUI/MJUIInput'
import { Controller, useForm, useWatch } from 'react-hook-form'
import MJUISelect from '@/components/MJUI/MJUISelect'
import MJPlayerSelectDialog from '@/components/MJPlayerSelectDialog'
import { createPlayerToDatabase } from '@/helpers/database.helper'

const DEFAULT_PLAYER_MAP: Record<PlayerIndex, Player> = {
  '0': {
    title: '',
    name: '玩家A',
    color: '#6700cf',
  },
  '1': {
    title: '',
    name: '玩家B',
    color: '#00b5de',
  },
  '2': {
    title: '',
    name: '玩家C',
    color: '#e3277b',
  },
  '3': {
    title: '',
    name: '玩家D',
    color: '#03ada5',
  },
}

export const DEFAULT_MATCH_NAME = `${new Date()
  .toISOString()
  .substring(0, 10)} 對局`

type FormProps = {
  name: string
} & MatchSetting

function CreateMatchPage() {
  const fb = useFirebaseDatabase()
  const [, setLocation] = useLocation()

  const { getValues: getMatchSettingValues, control: formControl } =
    useForm<FormProps>({
      defaultValues: {
        name: DEFAULT_MATCH_NAME,
        startingScore: '25000',
        isManganRoundUp: '1',
        yakuMax: '12',
        yakumanMax: '13',
      },
    })
  const watchedStartingScore = useWatch({
    name: 'startingScore',
    control: formControl,
  })

  const [players, setPlayers] =
    useState<Record<PlayerIndex, Player>>(DEFAULT_PLAYER_MAP)
  const [activePlayerData, setActivePlayerData] = useState<{
    player: Player
    index: PlayerIndex
  }>()

  const [isShowEditDialog, toggleEditDialog] = useBoolean(false)
  const handleClickEditPlayer = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const chosenPlayerIndex = e.currentTarget.getAttribute(
        'data-player-index'
      ) as PlayerIndex

      if (!chosenPlayerIndex) {
        return
      }

      const chosenPlayer = players[chosenPlayerIndex]

      setActivePlayerData({
        index: chosenPlayerIndex,
        player: chosenPlayer,
      })
      toggleEditDialog(true)
    },
    [players, toggleEditDialog]
  )

  const handleSubmitPlayerForm = useCallback(
    async (newPlayer: Player) => {
      if (!activePlayerData) {
        return
      }

      setPlayers((prev) => ({
        ...prev,
        [activePlayerData.index]: {
          ...prev[activePlayerData.index],
          ...newPlayer,
        },
      }))
      toggleEditDialog(false)
    },
    [activePlayerData, toggleEditDialog]
  )

  const handleCloseEditDialog = useCallback(() => {
    toggleEditDialog(false)
  }, [toggleEditDialog])

  const [searchPlayerAction, setSearchPlayerAction] = useState<string | null>()
  const handleClickSearchPlayer = useCallback((e: MouseEvent) => {
    e.preventDefault()
    setSearchPlayerAction('choose')
  }, [])

  const handleClosePlayerSelectDialog = useCallback(() => {
    setSearchPlayerAction(null)
  }, [])

  const handleSelectPlayer = useCallback(
    (_: unknown, selectedPlayer: Player) => {
      if (searchPlayerAction === 'choose') {
        setActivePlayerData((prev) =>
          prev
            ? {
                ...prev,
                player: selectedPlayer,
              }
            : undefined
        )
        setSearchPlayerAction(null)
      }
    },
    [searchPlayerAction]
  )

  const handleClickSwap = useCallback((e: React.MouseEvent) => {
    const ele = e.currentTarget as HTMLButtonElement
    if (!ele) {
      return
    }

    const playerIndex = ele.getAttribute('data-player-index') as PlayerIndex
    if (!playerIndex) {
      return
    }

    const nextPlayerIndex: PlayerIndex =
      // eslint-disable-next-line no-nested-ternary
      playerIndex === '0' ? '1' : playerIndex === '1' ? '2' : '3'

    setPlayers((prev) => ({
      ...prev,
      [playerIndex]: prev[nextPlayerIndex],
      [nextPlayerIndex]: prev[playerIndex],
    }))
  }, [])

  const [{ loading: isStarting }, handleClickStart] = useAsyncFn(async () => {
    const { name, ...matchSetting } = getMatchSettingValues()

    const finalizedPlayers = await Promise.all(
      Object.values(players).map((oldPlayer) => {
        if (
          !!oldPlayer.id ||
          oldPlayer.name === '玩家A' ||
          oldPlayer.name === '玩家B' ||
          oldPlayer.name === '玩家C' ||
          oldPlayer.name === '玩家D'
        ) {
          return Promise.resolve(oldPlayer)
        }

        return createPlayerToDatabase(oldPlayer)
      })
    )

    const match: Match = {
      code: generateMatchCode(),
      name,
      remark: '',
      createdAt: new Date().toISOString(),
      createdBy: 'Dicky',
      updatedAt: new Date().toISOString(),
      updatedBy: 'Dicky',
      setting: matchSetting,
      players: {
        '0': finalizedPlayers[0],
        '1': finalizedPlayers[1],
        '2': finalizedPlayers[2],
        '3': finalizedPlayers[3],
      },
      activeResultDetail: null,
    }

    const matchRef = await fb.push(`matches`, match)

    const startingScore = parseInt(matchSetting.startingScore)

    const matchRound: MatchRound = {
      matchId: matchRef.key as string,
      code: generateMatchRoundCode(match.code, 1, 0),
      roundCount: 1,
      extendedRoundCount: 0,
      cumulatedThousands: 0,
      nextRoundCumulatedThousands: 0,
      resultType: 0,
      nextRoundType: 0,
      playerResults: {
        '0': {
          beforeScore: startingScore,
          afterScore: startingScore,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
        },
        '1': {
          beforeScore: startingScore,
          afterScore: startingScore,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
        },
        '2': {
          beforeScore: startingScore,
          afterScore: startingScore,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
        },
        '3': {
          beforeScore: startingScore,
          afterScore: startingScore,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
        },
      },
      doras: [],
    }

    await fb.push(`matchRounds`, matchRound)

    setLocation(`/match/${matchRound.matchId}/obs`)
  }, [fb, getMatchSettingValues, players, setLocation])

  return (
    <>
      <div className="container mx-auto max-w-screen-sm">
        <div className="min-h-screen flex flex-col py-16 gap-y-4">
          <div className="shrink-0">
            <a href="/" className="underline">
              &lt; 回上一頁
            </a>
          </div>
          <div className="flex-1">
            <div className="space-y-12">
              <div className="space-y-4">
                <h1 className="text-4xl">對局</h1>
                <MJUIFormGroup label="對局名稱">
                  <Controller
                    name="name"
                    control={formControl}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <div className="text-xl">
                        <MJUIInput {...field} />
                      </div>
                    )}
                  />
                </MJUIFormGroup>

                <div className="grid grid-cols-3 gap-4">
                  <MJUIFormGroup label="起始點數">
                    <Controller
                      name="startingScore"
                      control={formControl}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <MJUISelect {...field}>
                          <option value="25000">25000</option>
                          <option value="30000">30000</option>
                          <option value="35000">35000</option>
                          <option value="50000">50000</option>
                          <option value="100000">100000</option>
                        </MJUISelect>
                      )}
                    />
                  </MJUIFormGroup>

                  <MJUIFormGroup label="滿貫切上">
                    <Controller
                      name="isManganRoundUp"
                      control={formControl}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <MJUISelect {...field}>
                          <option value="0">不切上</option>
                          <option value="1">
                            切上 (3翻70符 & 4翻40符 = 滿貫)
                          </option>
                        </MJUISelect>
                      )}
                    />
                  </MJUIFormGroup>

                  <MJUIFormGroup label="累積翻數上限">
                    <Controller
                      name="yakuMax"
                      control={formControl}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <MJUISelect {...field}>
                          <option value="12">三倍滿 (12翻)</option>
                          <option value="13">累計役滿 (13翻)</option>
                        </MJUISelect>
                      )}
                    />
                  </MJUIFormGroup>

                  <MJUIFormGroup label="役滿上限">
                    <Controller
                      name="yakumanMax"
                      control={formControl}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <MJUISelect {...field}>
                          <option value="13">單役滿</option>
                          <option value="26">兩倍役滿</option>
                          <option value="39">三倍役滿</option>
                          <option value="130">無上限</option>
                        </MJUISelect>
                      )}
                    />
                  </MJUIFormGroup>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl">玩家</h1>
                <div>
                  {(['0', '1', '2', '3'] as PlayerIndex[]).map(
                    (playerIndex) => (
                      <>
                        <div
                          key={playerIndex}
                          className="flex items-center gap-x-4"
                        >
                          <div className="shrink-0">
                            <div className="h-14 w-14 border-4 rounded border-black text-[40px] flex items-center justify-center pb-1">
                              <MJPositionSpan playerIndex={playerIndex} />
                            </div>
                          </div>

                          <div
                            className="flex-1 text-[48px] cursor-pointer hover:scale-105"
                            data-player-index={playerIndex}
                            onClick={handleClickEditPlayer}
                          >
                            <MJPlayerCardDiv
                              player={players[playerIndex]}
                              score={watchedStartingScore as unknown as number}
                            />
                          </div>
                        </div>
                        {playerIndex !== '3' && (
                          <div className="text-center">
                            <MJUIButton
                              variant="icon"
                              color="secondary"
                              type="button"
                              data-player-index={playerIndex}
                              onClick={handleClickSwap}
                            >
                              <span className="material-symbols-outlined">
                                swap_vert
                              </span>
                            </MJUIButton>
                          </div>
                        )}
                      </>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="shrink-0 space-y-4">
            <MJUIButton
              size="xlarge"
              className="w-full"
              onClick={handleClickStart}
              loading={isStarting}
              type="submit"
            >
              開始對局
            </MJUIButton>
          </div>
        </div>
      </div>

      <MJUIDialogV2
        title={
          <div className="space-x-4">
            <span>修改玩家</span>
            <a
              href="#"
              className="text-xs underline font-normal text-teal-600 hover:text-teal-500 align-middle"
              onClick={handleClickSearchPlayer}
            >
              <span className="material-symbols-outlined text-xs">search</span>{' '}
              搜尋玩家
            </a>
          </div>
        }
        open={isShowEditDialog}
        onClose={handleCloseEditDialog}
      >
        <div className="container space-y-6">
          {!!activePlayerData?.player.id && (
            <div className="py-2 px-3 bg-yellow-200 text-yellow-800 rounded">
              注意：在這裡的修改不會儲存到玩家列表的資料庫。假如你想保留這些修改，請在{' '}
              <a
                href="/players"
                target="_blank"
                className="text-teal-600 underline"
              >
                玩家列表
                <span className="material-symbols-outlined text-xs">
                  open_in_new
                </span>{' '}
              </a>{' '}
              中修改。
            </div>
          )}
          <MJPlayerForm
            onSubmit={handleSubmitPlayerForm}
            defaultValue={activePlayerData?.player}
          />
        </div>
      </MJUIDialogV2>

      <MJPlayerSelectDialog
        open={searchPlayerAction === 'choose'}
        onSelect={handleSelectPlayer}
        onClose={handleClosePlayerSelectDialog}
      />
    </>
  )
}

export default CreateMatchPage
