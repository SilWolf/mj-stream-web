import MJPositionSpan from '@/components/MJPositionSpan'
import { MatchRound, Player, PlayerIndex } from '@/models'
import React, { useCallback, useState } from 'react'
import {
  useFirebaseDatabase,
  useFirebaseDatabaseByKey,
} from '@/providers/firebaseDatabase.provider'
import {
  generateMatchCode,
  generateMatchRoundCode,
} from '@/helpers/mahjong.helper'
import { useLocation } from 'wouter'
import MJPlayerSelectDialog from '@/components/MJPlayerSelectDialog'
import { useBoolean } from 'react-use'
import MJPlayerInfoCardDiv from '@/components/MJPlayerInfoCardDiv'
import MJUIButton from '@/components/MJUI/MJUIButton'

function CreateMatchPage() {
  const fb = useFirebaseDatabase()
  const [, setLocation] = useLocation()

  const { data: databasePlayers = {} } =
    useFirebaseDatabaseByKey<Player>('players')

  const [players, setPlayers] = useState<
    Record<PlayerIndex, Player & { _id?: string }>
  >({
    '0': {
      name: '玩家A',
      color: '#6700cf',
    },
    '1': {
      name: '玩家B',
      color: '#00b5de',
    },
    '2': {
      name: '玩家C',
      color: '#e3277b',
    },
    '3': {
      name: '玩家D',
      color: '#03ada5',
    },
  })

  const handleEditPlayer = useCallback(
    (playerIndex: PlayerIndex, newPlayer: Player) => {
      setPlayers((prev) => ({ ...prev, [playerIndex]: newPlayer }))
      return Promise.resolve()
    },
    []
  )

  const handleClickQRScan = useCallback(() => {
    alert('掃瞄QR Code功能未開放。')
  }, [])

  const handleClickEnterCode = useCallback(() => {
    alert('輸入會員編號功能未開放。')
  }, [])

  const handleClickSwap = useCallback((e: React.MouseEvent) => {
    const ele = e.currentTarget as HTMLButtonElement
    if (!ele) {
      return
    }

    const playerIndex = ele.getAttribute('data-playerIndex') as PlayerIndex
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

  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<
    PlayerIndex | undefined
  >()
  const [showPlayerSelectDialog, togglePlayerSelectDialog] = useBoolean(false)

  const handleClickSelectPlayer = useCallback(
    (e: React.MouseEvent) => {
      if (!e.currentTarget) {
        return
      }

      const playerIndex = e.currentTarget.getAttribute(
        'data-player-index'
      ) as PlayerIndex

      setSelectedPlayerIndex(playerIndex)
      togglePlayerSelectDialog(true)
    },
    [togglePlayerSelectDialog]
  )

  const handleSelectPlayer = useCallback(
    (_id: string, player: Player) => {
      if (!selectedPlayerIndex) {
        return
      }

      setPlayers((prev) => ({
        ...prev,
        [selectedPlayerIndex]: {
          ...players[selectedPlayerIndex],
          ...player,
          _id,
        },
      }))
      togglePlayerSelectDialog(false)
    },
    [players, selectedPlayerIndex, togglePlayerSelectDialog]
  )

  const handleCloseSelectPlayerDialog = useCallback(() => {
    togglePlayerSelectDialog(false)
  }, [togglePlayerSelectDialog])

  const handleClickStart = useCallback(async () => {
    const playerIds: string[] = []
    const playerValues = Object.values(players)

    if (playerValues[0]._id) {
      playerIds.push(playerValues[0]._id)
    } else {
      playerIds.push(
        await fb
          .push('players', playerValues[0])
          .then((ref) => ref.key as string)
      )
    }

    if (playerValues[1]._id) {
      playerIds.push(playerValues[1]._id)
    } else {
      playerIds.push(
        await fb
          .push('players', playerValues[1])
          .then((ref) => ref.key as string)
      )
    }

    if (playerValues[2]._id) {
      playerIds.push(playerValues[2]._id)
    } else {
      playerIds.push(
        await fb
          .push('players', playerValues[2])
          .then((ref) => ref.key as string)
      )
    }

    if (playerValues[3]._id) {
      playerIds.push(playerValues[3]._id)
    } else {
      playerIds.push(
        await fb
          .push('players', playerValues[3])
          .then((ref) => ref.key as string)
      )
    }

    // const matchId = getRandomId()
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
      [`player_${playerIds[0]}`]: {
        position: 0,
        score: 25000,
        rank: 1,
        point: 0,
      },
      [`player_${playerIds[1]}`]: {
        position: 1,
        score: 25000,
        rank: 1,
        point: 0,
      },
      [`player_${playerIds[2]}`]: {
        position: 2,
        score: 25000,
        rank: 1,
        point: 0,
      },
      [`player_${playerIds[3]}`]: {
        position: 3,
        score: 25000,
        rank: 1,
        point: 0,
      },
    }

    const matchRef = await fb.push(`matches`, match)

    const matchRound: MatchRound = {
      matchId: matchRef.key as string,
      code: generateMatchRoundCode(match.code, 1, 0),
      roundCount: 1,
      extendedRoundCount: 0,
      cumulatedThousands: 0,
      resultType: 0,
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

                      <MJPlayerInfoCardDiv
                        playerIndex={playerIndex}
                        player={players[playerIndex]}
                        onEdit={handleEditPlayer}
                      />

                      <div className="shrink-0 space-x-2">
                        <MJUIButton
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
                        </MJUIButton>
                      </div>
                    </div>
                    {playerIndex !== '3' && (
                      <div className="text-center">
                        <MJUIButton
                          variant="icon"
                          color="secondary"
                          type="button"
                          data-playerIndex={playerIndex}
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

      <MJPlayerSelectDialog
        open={showPlayerSelectDialog}
        players={databasePlayers}
        onSelect={handleSelectPlayer}
        onClose={handleCloseSelectPlayerDialog}
      />
    </>
  )
}

export default CreateMatchPage
