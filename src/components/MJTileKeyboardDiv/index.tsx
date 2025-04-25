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

function MJTileKeyboardDiv({
  onSubmit,
  onRemove,
  canRemove,
  hideRedTiles,
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

  const handleClickSubmit = useCallback(() => {
    if (selectedTileKeys && onSubmit) {
      onSubmit?.(selectedTileKeys)
      setSelectedTileKeys([])
    }
  }, [onSubmit, selectedTileKeys])

  const handleClickRemove = useCallback(() => {
    if (canRemove) {
      onRemove?.()
      setSelectedTileKeys([])
    }
  }, [canRemove, onRemove])

  useEffect(() => {
    setSelectedTileKeys((defaultValue as MJTileKey[]) ?? [])
  }, [defaultValue])

  return (
    <div>
      <div
        className={`mb-4 grid ${
          hideRedTiles ? 'grid-cols-9' : 'grid-cols-10'
        } gap-1 lg:gap-x-2 lg:gap-y-4 items-center text-center`}
      >
        {tileGroups.map((tileGroup) =>
          tileGroup.map(
            (tileKey: MJTileKey) =>
              (!tileKey.startsWith('0') || !hideRedTiles) && (
                <button
                  type="button"
                  onClick={handleClickTile}
                  data-key={tileKey}
                  className={`${
                    selectedTileKeys.indexOf(tileKey) !== -1
                      ? 'bg-blue-400'
                      : 'bg-black/20'
                  } rounded p-1 lg:p-2`}
                >
                  <MJTileDiv>{tileKey}</MJTileDiv>
                </button>
              )
          )
        )}
      </div>
      <div className="flex gap-x-4">
        {canRemove && (
          <div className="flex-1">
            <MJUIButton
              className="w-full"
              type="button"
              color="secondary"
              onClick={handleClickRemove}
            >
              移除
            </MJUIButton>
          </div>
        )}
        <div className="flex-1">
          <MJUIButton
            className="w-full"
            type="button"
            color="primary"
            onClick={handleClickSubmit}
            disabled={selectedTileKeys.length === 0}
          >
            確定
          </MJUIButton>
        </div>
      </div>
    </div>
  )
}

export default MJTileKeyboardDiv
