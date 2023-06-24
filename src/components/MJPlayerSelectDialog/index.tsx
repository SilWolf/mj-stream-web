import React, { useCallback, useMemo } from 'react'
import { Player } from '@/models'
import MJUIDialogV2, { MJUIDialogV2Props } from '../MJUI/MJUIDialogV2'
import MJPlayerInfoCardDiv from '../MJPlayerInfoCardDiv'

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
      {myPlayers.length === 0 && (
        <div className="text-gray-500 text-center py-4">
          沒有儲存的玩家。請先在外面新增玩家，然後開始對局，下一次該玩家就可供選擇。
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {myPlayers.map((player) => (
          <button
            type="button"
            key={player._id}
            className="text-left flex items-center gap-x-2"
            onClick={handleClickPlayer}
            data-id={player._id}
          >
            <MJPlayerInfoCardDiv playerIndex="0" player={player} />
          </button>
        ))}
      </div>
    </MJUIDialogV2>
  )
}

export default MJPlayerSelectDialog
