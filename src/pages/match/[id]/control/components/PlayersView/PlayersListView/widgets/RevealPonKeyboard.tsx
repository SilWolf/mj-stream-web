import MJTileCombinationDiv from '@/components/MJTileCombinationDiv'
import MJTileKeyboardMiniDiv from '@/components/MJTileKeyboardMiniDiv'
import { useCallback, useMemo, useState } from 'react'

const getPossibleCombinationsOfTile = (tile: string) => {
  if (['5m', '0m', '5p', '0p', '5s', '0s'].indexOf(tile) === -1) {
    // tiles
    return [
      `${tile}-${tile}${tile}`,
      `${tile}${tile}-${tile}`,
      `${tile}${tile}${tile}-`,
    ]
  }

  if (tile[0] === '0') {
    return [
      `${tile}-5${tile[1]}5${tile[1]}`,
      `5${tile[1]}${tile}-5${tile[1]}`,
      `5${tile[1]}5${tile[1]}${tile}-`,
    ]
  }

  return [
    `${tile}-${tile}${tile}`,
    `${tile}${tile}-${tile}`,
    `${tile}${tile}${tile}-`,
    `${tile}-5${tile[1]}0${tile[1]}`,
    `5${tile[1]}${tile}-0${tile[1]}`,
    `5${tile[1]}0${tile[1]}${tile}-`,
  ]
}

export default function RevealPonKeyboard({
  onClick,
}: {
  onClick?: (combination: string) => void
}) {
  const [selectedTile, setSelectedTile] = useState<string | null>(null)

  const possibleCombinations = useMemo(
    () => (selectedTile ? getPossibleCombinationsOfTile(selectedTile) : null),
    [selectedTile]
  )

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const value = (e.currentTarget as HTMLDivElement).getAttribute(
        'data-value'
      ) as string
      onClick?.(value)
      setSelectedTile(null)
    },
    [onClick]
  )

  if (possibleCombinations) {
    return (
      <div className="**:data-button:flex **:data-button:justify-center **:data-button:p-1 **:data-button:cursor-pointer **:data-button:hover:bg-base-200">
        <div className="w-[12em] h-[4em] grid grid-cols-3 items-start">
          {possibleCombinations.map((combination) => (
            <button
              key={combination}
              onClick={handleClick}
              data-value={combination}
              data-button
            >
              <MJTileCombinationDiv value={combination} />
            </button>
          ))}
        </div>
        <div>
          <button
            className="w-full text-[16px]"
            data-button
            onClick={() => setSelectedTile(null)}
          >
            <i className="bi bi-x-circle-fill"></i>
          </button>
        </div>
      </div>
    )
  }

  return <MJTileKeyboardMiniDiv onClick={setSelectedTile} />
}
