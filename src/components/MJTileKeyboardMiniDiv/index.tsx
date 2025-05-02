import React, { useCallback } from 'react'
import { MJTileKey } from '../MJTileDiv'
import MJTileV2Div from '../MJTileV2Div'

const tileGroups: MJTileKey[][] = [
  ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m', '0m'],
  ['1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '0p'],
  ['1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '0s'],
  ['1z', '2z', '3z', '4z', '5z', '6z', '7z'],
]

type Props = {
  onClick?: (tileKey: MJTileKey) => void
  hideJiHai?: boolean
}

function MJTileKeyboardMiniDiv({ onClick, hideJiHai }: Props) {
  const handleClickTile = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const tileKey = e.currentTarget?.getAttribute('data-key') as MJTileKey
      onClick?.(tileKey)
    },
    [onClick]
  )

  return (
    <div>
      <div className="grid grid-cols-10 gap-x-2 items-center w-[12em] h-[6em] **:data-button:cursor-pointer">
        {tileGroups.map((tileGroup) =>
          tileGroup.map((tileKey: MJTileKey) => {
            if (hideJiHai && tileKey[1] === 'z') {
              return undefined
            }

            return (
              <button
                key={tileKey}
                type="button"
                onClick={handleClickTile}
                data-key={tileKey}
                data-button
              >
                <MJTileV2Div value={tileKey} />
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

export default MJTileKeyboardMiniDiv
