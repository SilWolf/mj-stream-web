import React, { useCallback, useState } from 'react'
import { Player } from '@/models'
import MJUIDialogV2, { MJUIDialogV2Props } from '../MJUI/MJUIDialogV2'
import MJPlayerInfoCardDiv from '../MJPlayerInfoCardDiv'
import { getPlayersFromDatabase } from '@/helpers/database.helper'
import { useAsync } from 'react-use'
import MJUIButton from '../MJUI/MJUIButton'
import { getRandomId } from '@/utils/string.util'

type Props = {
  onSelect: (id: string, player: Player) => unknown
} & Omit<MJUIDialogV2Props, 'children'>

function MJPlayerSelectDialog({ onSelect, ...dialogProps }: Props) {
  const [refreshKey, sekRefreshKey] = useState<string>('')
  const handleClickRefresh = useCallback(() => {
    sekRefreshKey(getRandomId())
  }, [])
  return (
    <MJUIDialogV2 title="選擇玩家" {...dialogProps}>
      <MJUIButton onClick={handleClickRefresh} color="secondary">
        刷新列表
      </MJUIButton>
      <div className="mt-4">
        <MJPlayerList key={refreshKey} onClickPlayer={onSelect} />
      </div>
    </MJUIDialogV2>
  )
}

export default MJPlayerSelectDialog

type MJPlayerListProps = {
  onClickPlayer?: (id: string, player: Player) => unknown
  onClickClone?: (player: Player) => unknown
  onClickDelete?: (id: string) => unknown
}

export const MJPlayerList = ({
  onClickPlayer,
  onClickClone,
  onClickDelete,
}: MJPlayerListProps) => {
  const { value: players, loading } = useAsync(getPlayersFromDatabase)

  const handleClickPlayer = useCallback(
    (e: React.MouseEvent) => {
      if (!onClickPlayer) {
        return
      }

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

      onClickPlayer(id, player)
    },
    [onClickPlayer, players]
  )

  const handleClickClone = useCallback(
    (e: React.MouseEvent) => {
      if (!onClickClone) {
        return
      }

      if (!players) {
        return
      }
      const clickedId = e.currentTarget.getAttribute('data-id')
      if (!clickedId) {
        return
      }

      const player = players.find((player) => player.id === clickedId)
      if (!player) {
        return
      }

      const { id, ...clonedPlayer } = player

      onClickClone(clonedPlayer)
    },
    [onClickClone, players]
  )

  const handleClickDelete = useCallback(
    (e: React.MouseEvent) => {
      if (!onClickDelete) {
        return
      }

      const clickedId = e.currentTarget.getAttribute('data-id')
      if (!clickedId) {
        return
      }

      onClickDelete(clickedId)
    },
    [onClickDelete]
  )

  return (
    <>
      {loading && (
        <div className="w-32 text-center mx-auto my-8">
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
      <div
        className={`grid grid-cols-1 gap-2 ${
          onClickClone || onClickDelete ? '' : 'md:grid-cols-2'
        }`}
      >
        {!loading &&
          players?.map((player) => (
            <div
              key={player.id}
              className="text-left flex items-center gap-x-2"
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={handleClickPlayer}
                data-id={player.id}
              >
                <MJPlayerInfoCardDiv player={player} />
              </div>
              {onClickClone && (
                <div className="shrink-0">
                  <MJUIButton
                    color="primary"
                    variant="text"
                    onClick={handleClickClone}
                    data-id={player.id}
                  >
                    複製
                  </MJUIButton>
                </div>
              )}
              {onClickDelete && (
                <div className="shrink-0">
                  <MJUIButton
                    color="danger"
                    variant="text"
                    onClick={handleClickDelete}
                    data-id={player.id}
                  >
                    刪除
                  </MJUIButton>
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  )
}
