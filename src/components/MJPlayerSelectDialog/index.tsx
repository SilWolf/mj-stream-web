import React, { useCallback, useMemo } from 'react'
import { Player } from '@/models'
import MJUIDialogV2, { MJUIDialogV2Props } from '../MJUI/MJUIDialogV2'

type Props = {
  players: Record<string, Player>
  onSelect: (id: string, player: Player) => unknown
} & Omit<MJUIDialogV2Props, 'children'>

function MJPlayerSelectDialog({ players, onSelect, ...dialogProps }: Props) {
  const myPlayers = useMemo(
    () =>
      players
        ? Object.entries(players).map(
            ([_id, player]) => ({
              ...player,
              _id,
            }),
            []
          )
        : [],
    [players]
  )

  const handleClickPlayer = useCallback(
    (e: React.MouseEvent) => {
      const id = e.currentTarget.getAttribute('data-id')
      if (!id) {
        return
      }

      const player = players[id]
      if (!player) {
        return
      }

      onSelect(id, player)
    },
    [onSelect, players]
  )

  return (
    <MJUIDialogV2 title="選擇玩家" {...dialogProps}>
      <div className="space-y-4">
        {myPlayers.map((player) => (
          <button
            type="button"
            key={player._id}
            className="flex items-center gap-x-2"
            onClick={handleClickPlayer}
            data-id={player._id}
          >
            <div className="flex-1 flex items-center gap-x-2 bg-white bg-opacity-30 rounded p-2">
              <div className="shrink-0">
                <div
                  className="w-14 h-14 bg-center bg-contain bg-no-repeat"
                  style={{
                    backgroundImage: `url(${
                      player.propicSrc ?? '/images/portrait-placeholder.jpeg'
                    })`,
                  }}
                />
              </div>
              <div className="flex-1">
                <div>{player.title}</div>
                <div className="text-2xl">{player.name}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </MJUIDialogV2>
  )
}

export default MJPlayerSelectDialog
