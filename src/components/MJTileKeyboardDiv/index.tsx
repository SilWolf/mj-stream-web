import React, { useCallback, useState } from 'react'
import MJTileDiv, { MJTileKey } from '../MJTileDiv'
import MJUIButton from '../MJUI/MJUIButton'

const tileGroups: MJTileKey[][] = [
  ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m', '0m'],
  ['1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '0p'],
  ['1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '0s'],
  ['1z', '2z', '3z', '4z', '5z', '6z', '7z'],
]

type Props = {
  onSubmit?: (tileKey: MJTileKey) => void
  onRemove?: () => void
  canRemove?: boolean
  hideRedTiles?: boolean
}

function MJTileKeyboardDiv({
  onSubmit,
  onRemove,
  canRemove,
  hideRedTiles,
}: Props) {
  const [selectedTileKey, setSelectedTileKey] = useState<
    MJTileKey | undefined
  >()

  const handleClickTile = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const tileKey = e.currentTarget?.getAttribute('data-key') as MJTileKey

      if (tileKey) {
        setSelectedTileKey(tileKey)
      }
    },
    []
  )

  const handleClickSubmit = useCallback(() => {
    if (selectedTileKey && onSubmit) {
      onSubmit?.(selectedTileKey)
      setSelectedTileKey(undefined)
    }
  }, [onSubmit, selectedTileKey])

  const handleClickRemove = useCallback(() => {
    if (canRemove) {
      onRemove?.()
      setSelectedTileKey(undefined)
    }
  }, [canRemove, onRemove])

  return (
    <div>
      <div
        className={`mb-4 grid ${
          hideRedTiles ? 'grid-cols-9' : 'grid-cols-10'
        } gap-1 lg:gap-x-2 lg:gap-y-4 items-center text-center`}
      >
        {tileGroups.map((tileGroup) =>
          tileGroup.map(
            (tileKey: string) =>
              (!tileKey.startsWith('0') || !hideRedTiles) && (
                <button
                  type="button"
                  onClick={handleClickTile}
                  data-key={tileKey}
                  className={`${
                    selectedTileKey === tileKey
                      ? 'bg-blue-400'
                      : 'bg-black bg-opacity-20'
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
            disabled={!selectedTileKey}
          >
            確定
          </MJUIButton>
        </div>
      </div>
    </div>
  )
}

export default MJTileKeyboardDiv
