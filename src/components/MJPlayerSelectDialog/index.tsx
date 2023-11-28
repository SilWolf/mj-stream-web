import React, { useCallback } from 'react'
import { Player } from '@/models'
import MJUIDialogV2, { MJUIDialogV2Props } from '../MJUI/MJUIDialogV2'
import MJPlayerInfoCardDiv from '../MJPlayerInfoCardDiv'
import { getPlayersFromDatabase } from '@/helpers/database.helper'
import { useAsync } from 'react-use'

type Props = {
  onSelect: (id: string, player: Player) => unknown
} & Omit<MJUIDialogV2Props, 'children'>

function MJPlayerSelectDialog({ onSelect, ...dialogProps }: Props) {
  const { value: players, loading } = useAsync(getPlayersFromDatabase)

  const handleClickPlayer = useCallback(
    (e: React.MouseEvent) => {
      if (!players) {
        return
      }
      const id = e.currentTarget.getAttribute('data-id')
      if (!id) {
        return
      }

      const player = players.find((player) => player.id === id)
      if (!player) {
        return
      }

      onSelect(id, player)
    },
    [onSelect, players]
  )

  return (
    <MJUIDialogV2 title="選擇玩家" {...dialogProps}>
      {loading && (
        <div className="w-32 text-center mx-auto my-24">
          <span className="material-symbols-outlined animate-spin text-4xl">
            progress_activity
          </span>
        </div>
      )}
      {!loading && players?.length === 0 && (
        <div className="text-gray-500 text-center py-4">
          <p>
            <span className="material-symbols-outlined text-[56px]">
              search_off
            </span>
          </p>
          <span>沒有已儲存的玩家</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {!loading &&
          players?.map((player) => (
            <div
              key={player.id}
              className="text-left flex items-center gap-x-2"
              onClick={handleClickPlayer}
              data-id={player.id}
            >
              <MJPlayerInfoCardDiv player={player} />
            </div>
          ))}
      </div>
    </MJUIDialogV2>
  )
}

export default MJPlayerSelectDialog
