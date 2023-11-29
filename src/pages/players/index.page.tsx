import MJUIButton from '@/components/MJUI/MJUIButton'
import MJUIDialogV2 from '@/components/MJUI/MJUIDialogV2'
import { Player } from '@/models'
import React, { useCallback, useState } from 'react'
import { useBoolean } from 'react-use'

import MJPlayerForm from '@/components/MJPlayerForm'
import { MJPlayerList } from '@/components/MJPlayerSelectDialog'
import {
  createPlayerToDatabase,
  updatePlayerToDatabase,
} from '@/helpers/database.helper'
import { getRandomId } from '@/utils/string.util'

function PlayersPage() {
  const [activePlayer, setActivePlayer] = useState<Player>()
  const [refreshKey, setRefreshKey] = useState<string>('1')

  const [isShowEditDialog, toggleEditDialog] = useBoolean(false)

  const handleCloseEditDialog = useCallback(
    () => toggleEditDialog(false),
    [toggleEditDialog]
  )

  const handleClickAdd = useCallback(() => {
    setActivePlayer(undefined)
    toggleEditDialog(true)
  }, [toggleEditDialog])

  const handleClickEdit = useCallback(
    (_: unknown, player: Player) => {
      setActivePlayer(player)
      toggleEditDialog(true)
    },
    [toggleEditDialog]
  )

  const handleSubmitPlayerForm = useCallback(
    (newOrOldPlayer: Player) => {
      if (newOrOldPlayer.id) {
        return updatePlayerToDatabase(newOrOldPlayer.id, newOrOldPlayer).then(
          () => {
            setRefreshKey(getRandomId())
            toggleEditDialog(false)
          }
        )
      } else {
        return createPlayerToDatabase(newOrOldPlayer).then(() => {
          setRefreshKey(getRandomId())
          toggleEditDialog(false)
        })
      }
    },
    [toggleEditDialog]
  )

  return (
    <>
      <div className="container mx-auto max-w-screen-sm space-y-4 py-16">
        <div className="shrink-0">
          <a href="/" className="underline">
            &lt; 回上一頁
          </a>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl">玩家</h1>
          </div>
          <div>
            <MJUIButton onClick={handleClickAdd}>新增</MJUIButton>
          </div>
        </div>

        <MJPlayerList key={refreshKey} onClickPlayer={handleClickEdit} />
      </div>

      <MJUIDialogV2
        title="新增／修改玩家"
        open={isShowEditDialog}
        onClose={handleCloseEditDialog}
      >
        <div className="container space-y-6">
          <MJPlayerForm
            onSubmit={handleSubmitPlayerForm}
            defaultValue={activePlayer}
          />
        </div>
      </MJUIDialogV2>
    </>
  )
}

export default PlayersPage
