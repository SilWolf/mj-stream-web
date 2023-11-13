import MJPlayerInfoCardDiv from '@/components/MJPlayerInfoCardDiv'
import MJUIButton from '@/components/MJUI/MJUIButton'
import MJUIDialogV2 from '@/components/MJUI/MJUIDialogV2'
import { Player } from '@/models'
import React, { useCallback, useMemo, useState } from 'react'
import { useBoolean } from 'react-use'

import MJPlayerForm from '@/components/MJPlayerForm'

function PlayersPage() {
  const [activePlayer, setActivePlayer] = useState<Player>()

  const players = useMemo(() => [], [])

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
    (player: Player) => {
      setActivePlayer(player)
      toggleEditDialog(true)
    },
    [toggleEditDialog]
  )

  const handleSubmitPlayerForm = useCallback(() => Promise.resolve(), [])

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
        <div className="space-y-2">
          {players.map((player) => (
            <MJPlayerInfoCardDiv
              player={player}
              onClickEdit={handleClickEdit}
            />
          ))}
        </div>
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
