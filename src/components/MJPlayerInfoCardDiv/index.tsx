import { RealtimePlayer } from '@/models'
import React, { HTMLAttributes, useCallback } from 'react'
import MJUIButton from '../MJUI/MJUIButton'

type Props = HTMLAttributes<HTMLDivElement> & {
  player: RealtimePlayer
  onClickEdit?: (newPlayer: RealtimePlayer) => unknown
}

function MJPlayerInfoCardDiv({ player, onClickEdit, ...divProps }: Props) {
  const handleClickEdit = useCallback(() => {
    onClickEdit?.(player)
  }, [onClickEdit, player])

  return (
    <div
      className="relative flex-1 flex items-center gap-x-2 rounded p-2 text-white"
      style={{
        backgroundColor: player.color ?? '#115e59',
      }}
      {...divProps}
    >
      {player.logoUrl && (
        <div
          className="absolute inset-0 opacity-10 bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(${player.logoUrl})`,
          }}
        ></div>
      )}
      <div className="relative z-10 shrink-0">
        <div
          className="w-14 h-14 bg-center bg-contain bg-no-repeat rounded"
          style={{
            backgroundImage: `url(${
              player.logoUrl || '/images/portrait-placeholder.jpeg'
            })`,
          }}
        />
      </div>
      <div className="flex-1 relative z-10 ">
        <div>{player.secondaryName ?? '(無頭銜)'}</div>
        <div className="text-2xl">{player.primaryName ?? '(無名稱)'}</div>
      </div>

      {onClickEdit && (
        <div className="shrink-0">
          <MJUIButton
            variant="icon"
            color="inverted"
            type="button"
            onClick={handleClickEdit}
          >
            <i className="bi bi-pencil"></i>
          </MJUIButton>
        </div>
      )}
    </div>
  )
}

export default MJPlayerInfoCardDiv
