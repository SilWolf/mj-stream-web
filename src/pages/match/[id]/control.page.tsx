import React, { useCallback, useState } from 'react'
import useMatch from '@/hooks/useMatch'
import { PlayerIndex } from '@/models'
import { useConfirmDialog } from '@/components/ConfirmDialog/provider'
import MJMatchRonDialog from '@/components/MJMatchRonDialog'
import { getIsPlayerEast } from '@/helpers/mahjong.helper'
import PlayerCardDiv from './components/PlayerCardDiv'

const PLAYER_CARD_CLASSNAME_MAP: Record<PlayerIndex, string> = {
  0: '!bg-blue-400',
  1: '!bg-red-400',
  2: '!bg-green-400',
  3: '!bg-yellow-400',
}

type Props = {
  params: { matchId: string }
}

export default function MatchControlPage({ params: { matchId } }: Props) {
  const { match, matchActiveRound } = useMatch(matchId)
  const [showRonDialog, setShowRonDialog] = useState<boolean>(true)
  const confirmDialog = useConfirmDialog()

  const handleClickRiichi = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const id = e.currentTarget.getAttribute(
        'data-id'
      ) as unknown as PlayerIndex
      if (!id) {
        return
      }

      const player = match?.players[id]
      if (!player) {
        return
      }

      confirmDialog.showConfirmDialog({
        title: '確定要立直嗎？',
        content: `一旦點擊確定，就會播出立直動畫，請確定立直的是 ${player.name}！`,
        onClickOk: async () => {
          return new Promise((res) => {
            setTimeout(res, 3000)
          })
        },
      })
    },
    [confirmDialog, match?.players]
  )

  const handleClickRon = useCallback(() => {
    setShowRonDialog(true)
  }, [])

  if (!match || !matchActiveRound) {
    return <div>對局讀取失敗。</div>
  }

  return (
    <div>
      <div className="w-full bg-white">
        <div className="flex">
          <div className="border-r border-gray-200">
            <button type="button" className="p-2 leading-none">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
          <div className="flex-1" />
        </div>
      </div>

      <div className="container mx-auto mt-8 px-8">
        <div className="space-y-4">
          {(['0', '1', '2', '3'] as PlayerIndex[]).map((index) => (
            <div className="flex gap-x-2 items-center">
              <div className="flex-1 text-[2.5rem]">
                <PlayerCardDiv
                  name={match.players[index].name}
                  title={match.players[index].title}
                  score={matchActiveRound.playerResults[index].beforeScore}
                  isEast={getIsPlayerEast(index, matchActiveRound.roundCount)}
                  className={`${PLAYER_CARD_CLASSNAME_MAP[index]} !bg-opacity-60`}
                />
              </div>
              <div className="space-y-1">
                <div>
                  <button
                    type="button"
                    className="px-2 py-0.5 border border-blue-600 text-blue-600 rounded"
                    onClick={handleClickRiichi}
                    data-id={index}
                  >
                    立直
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    className="px-2 py-0.5 border border-red-600 text-red-600 rounded"
                    onClick={handleClickRon}
                    data-id={index}
                  >
                    和了
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <MJMatchRonDialog
        match={match}
        matchRound={matchActiveRound}
        open={showRonDialog}
      />
    </div>
  )
}
