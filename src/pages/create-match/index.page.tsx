import MJPositionSpan from '@/components/MJPositionSpan'
import { MatchRound, Player, PlayerIndex } from '@/models'
import React, { useCallback, useState } from 'react'
import { useFirebaseDatabase } from '@/providers/firebaseDatabase.provider'
import {
  generateMatchCode,
  generateMatchRoundCode,
} from '@/helpers/mahjong.helper'
import { useLocation } from 'wouter'
import { useBoolean } from 'react-use'
import MJUIButton from '@/components/MJUI/MJUIButton'
import MJPlayerCardDiv from '@/components/MJPlayerCardDiv'
import MJUIDialogV2 from '@/components/MJUI/MJUIDialogV2'
import MJPlayerForm from '@/components/MJPlayerForm'

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

function CreateMatchPage() {
  const fb = useFirebaseDatabase()
  const [, setLocation] = useLocation()

  const [players, setPlayers] =
    useState<Record<PlayerIndex, Player>>(DEFAULT_PLAYER_MAP)
  const [activePlayerData, setActivePlayerData] = useState<{
    player: Player
    index: PlayerIndex
  }>()

  const [isShowEditDialog, toggleEditDialog] = useBoolean(false)
  const handleClickEditPlayer = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
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

  const handleClickStart = useCallback(async () => {
    const match = {
      code: generateMatchCode(),
      remark: '',
      createdAt: new Date().toISOString(),
      createdBy: 'Dicky',
      updatedAt: new Date().toISOString(),
      updatedBy: 'Dicky',
      setting: {
        template: 'mleague',
      },
      players,
    }

    const matchRef = await fb.push(`matches`, match)

    const matchRound: MatchRound = {
      matchId: matchRef.key as string,
      code: generateMatchRoundCode(match.code, 1, 0),
      roundCount: 1,
      extendedRoundCount: 0,
      cumulatedThousands: 0,
      resultType: 0,
      nextRoundType: 0,
      playerResults: {
        '0': {
          beforeScore: 25000,
          afterScore: 25000,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
        },
        '1': {
          beforeScore: 25000,
          afterScore: 25000,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
        },
        '2': {
          beforeScore: 25000,
          afterScore: 25000,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
        },
        '3': {
          beforeScore: 25000,
          afterScore: 25000,
          type: 0,
          scoreChanges: [],
          prevScoreChanges: [],
        },
      },
      doras: [],
    }

    await fb.push(`matchRounds`, matchRound)

    setLocation(`/match/${matchRound.matchId}/obs`)
  }, [fb, players, setLocation])

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
            <div className="space-y-4">
              <h1 className="text-4xl">玩家</h1>
              <div className="space-y-2">
                {(['0', '1', '2', '3'] as PlayerIndex[]).map((playerIndex) => (
                  <>
                    <div
                      key={playerIndex}
                      className="flex items-center gap-x-2"
                    >
                      <div className="shrink-0">
                        <div className="h-14 w-14 border-4 rounded border-black text-[2.5rem] flex items-center justify-center">
                          <MJPositionSpan playerIndex={playerIndex} />
                        </div>
                      </div>

                      <div className="flex-1 text-[2.5em]">
                        <MJPlayerCardDiv
                          player={players[playerIndex]}
                          score={25000}
                        />
                      </div>

                      <div className="shrink-0 space-x-2">
                        {/* <MJUIButton
                          variant="icon"
                          color="secondary"
                          type="button"
                          data-player-index={playerIndex}
                          onClick={handleClickQRScan}
                        >
                          <span className="material-symbols-outlined">
                            qr_code_scanner
                          </span>
                        </MJUIButton>
                        <MJUIButton
                          variant="icon"
                          color="secondary"
                          type="button"
                          data-player-index={playerIndex}
                          onClick={handleClickEnterCode}
                        >
                          <span className="material-symbols-outlined">123</span>
                        </MJUIButton>
                        <MJUIButton
                          variant="icon"
                          color="secondary"
                          type="button"
                          data-player-index={playerIndex}
                          onClick={handleClickSelectPlayer}
                        >
                          <span className="material-symbols-outlined">
                            arrow_drop_down_circle
                          </span>
                        </MJUIButton> */}
                        {/* <MJUIButton
                          variant="icon"
                          color="danger"
                          type="button"
                          data-player-index={playerIndex}
                          onClick={handleClickRemovePlayer}
                          disabled={!players[playerIndex]}
                        >
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                        </MJUIButton> */}
                        <MJUIButton
                          type="button"
                          data-player-index={playerIndex}
                          onClick={handleClickEditPlayer}
                          disabled={!players[playerIndex]}
                        >
                          修改
                        </MJUIButton>
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
                ))}
              </div>
            </div>
          </div>
          <div className="shrink-0 space-y-4">
            <MJUIButton
              size="xlarge"
              className="w-full"
              onClick={handleClickStart}
            >
              開始對局
            </MJUIButton>
          </div>
        </div>
      </div>

      <MJUIDialogV2
        title="修改玩家"
        open={isShowEditDialog}
        onClose={handleCloseEditDialog}
      >
        <div className="container space-y-6">
          <MJPlayerForm
            onSubmit={handleSubmitPlayerForm}
            defaultValue={activePlayerData?.player}
          />
        </div>
      </MJUIDialogV2>
    </>
  )
}

export default CreateMatchPage
