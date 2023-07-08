import { Player } from '@/models'
import React, { HTMLAttributes, useCallback } from 'react'
import MJUIButton from '../MJUI/MJUIButton'

type Props = HTMLAttributes<HTMLDivElement> & {
  player: Player
  onClickEdit?: (newPlayer: Player) => unknown
}

function MJPlayerInfoCardDiv({
  player,
  onClickEdit,
  children,
  ...divProps
}: Props) {
  const handleClickEdit = useCallback(() => {
    onClickEdit?.(player)
  }, [onClickEdit, player])

  return (
    <div
      className="flex-1 flex items-center gap-x-2 rounded p-2 text-white"
      style={{
        background: player.color ?? '#115e59',
      }}
      {...divProps}
    >
      <div className="shrink-0">
        <div
          className="w-14 h-14 bg-center bg-contain bg-no-repeat rounded"
          style={{
            backgroundImage: `url(${
              player.propicSrc || '/images/portrait-placeholder.jpeg'
            })`,
          }}
        />
      </div>
      <div className="flex-1">
        <div>{player.title ?? '(無頭銜)'}</div>
        <div className="text-2xl">{player.name ?? '(無名稱)'}</div>
      </div>

      {onClickEdit && (
        <div className="shrink-0">
          <MJUIButton
            variant="icon"
            color="inverted"
            type="button"
            onClick={handleClickEdit}
          >
            <span className="material-symbols-outlined">edit</span>
          </MJUIButton>
        </div>
      )}
    </div>
  )
}

export default MJPlayerInfoCardDiv
