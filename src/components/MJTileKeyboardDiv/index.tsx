import React, { useCallback, useState } from 'react'
import MJTileDiv, { MJTileKey } from '../MJTileDiv'

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
}

function MJTileKeyboardDiv({ onSubmit, onRemove, canRemove }: Props) {
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
    }
  }, [onSubmit, selectedTileKey])

  const handleClickRemove = useCallback(() => {
    if (canRemove) {
      onRemove?.()
    }
  }, [canRemove, onRemove])

  return (
    <div className="grid grid-cols-10 gap-1 lg:gap-4 items-center text-center">
      {tileGroups.map((tileGroup) =>
        tileGroup.map((tileKey) => (
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
        ))
      )}
      <div />
      <div>
        {canRemove && (
          <button
            type="button"
            className="rounded-full bg-white border border-white text-sm lg:text-md h-12 w-12 lg:h-16 lg:w-16"
            onClick={handleClickRemove}
          >
            移除
          </button>
        )}
      </div>
      <div>
        <button
          type="button"
          className="rounded-full bg-blue-400 disabled:opacity-20 border border-white text-sm lg:text-md h-12 w-12 lg:h-16 lg:w-16"
          onClick={handleClickSubmit}
          disabled={!selectedTileKey}
        >
          確定
        </button>
      </div>
    </div>
  )
}

export default MJTileKeyboardDiv
