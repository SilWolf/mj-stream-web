import { Player } from '@/models'
import React, { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  player: Player
}

function MJPlayerInfoCardDiv({ player, children, ...divProps }: Props) {
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
    </div>
  )
}

export default MJPlayerInfoCardDiv
