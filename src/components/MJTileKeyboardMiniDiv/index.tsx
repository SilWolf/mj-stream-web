import React, { useCallback, useEffect, useState } from 'react'
import MJTileDiv, { MJTileKey } from '../MJTileDiv'
import MJUIButton from '../MJUI/MJUIButton'

const tileGroups: MJTileKey[][] = [
  ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m', '0m'],
  ['1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '0p'],
  ['1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '0s'],
  ['1z', '2z', '3z', '4z', '5z', '6z', '7z'],
]

const SUIT_ORDER_MAP: Record<string, number> = {
  m: 0,
  p: 1,
  s: 2,
  z: 3,
}

const sortFn = (a: MJTileKey, b: MJTileKey) => {
  const [aNum, aSuit] = [a[0], a[1]]
  const [bNum, bSuit] = [b[0], b[1]]

  if (aSuit !== bSuit) {
    return SUIT_ORDER_MAP[aSuit] - SUIT_ORDER_MAP[bSuit]
  }

  return parseInt(aNum, 10) - parseInt(bNum, 10)
}

type Props = {
  onSubmit?: (tileKeys: MJTileKey[]) => void
  onRemove?: () => void
  canRemove?: boolean
  hideRedTiles?: boolean
  multiple?: boolean
  defaultValue?: string[] | undefined
}

function MJTileKeyboardMiniDiv({
  onSubmit,
  onRemove,
  canRemove,
  multiple,
  defaultValue,
}: Props) {
  const [selectedTileKeys, setSelectedTileKeys] = useState<MJTileKey[]>([])

  const handleClickTile = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const tileKey = e.currentTarget?.getAttribute('data-key') as MJTileKey

      if (tileKey) {
        if (multiple) {
          setSelectedTileKeys((prev) => {
            const index = prev.indexOf(tileKey)
            if (index === -1) {
              return [...prev, tileKey].sort(sortFn)
            }

            const newPrev = [...prev]
            newPrev.splice(index, 1)
            return newPrev
          })
        } else {
          setSelectedTileKeys([tileKey])
        }
      }
    },
    [multiple]
  )

  useEffect(() => {
    setSelectedTileKeys((defaultValue as MJTileKey[]) ?? [])
  }, [defaultValue])

  return (
    <div>
      <div className="grid grid-cols-10 items-center text-center w-[360px] h-[200px]">
        {tileGroups.map((tileGroup) =>
          tileGroup.map((tileKey: MJTileKey) => (
            <button
              type="button"
              onClick={handleClickTile}
              data-key={tileKey}
              className="rounded w-[32px]!"
            >
              <MJTileDiv className="w-full!">{tileKey}</MJTileDiv>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

export default MJTileKeyboardMiniDiv
