import MJTileCombinationDiv from '@/components/MJTileCombinationDiv'
import MJTileKeyboardMiniDiv from '@/components/MJTileKeyboardMiniDiv'
import { useCallback, useMemo, useState } from 'react'

const getPossibleCombinationsOfTile = (tile: string) => {
  const value = parseInt(tile[0])
  const suit = tile[1]

  if (value === 0) {
    return [
      `${tile}-3${suit}4${suit}`,
      `${tile}-4${suit}6${suit}`,
      `${tile}-6${suit}7${suit}`,
    ]
  }

  const combinations: string[] = []

  if (value - 2 >= 1 && value - 1 <= 9) {
    combinations.push(`${value - 2}${suit}${value - 1}${suit}`)
  }
  if (value - 1 >= 1 && value + 1 <= 9) {
    combinations.push(`${value - 1}${suit}${value + 1}${suit}`)
  }
  if (value + 1 >= 1 && value + 2 <= 9) {
    combinations.push(`${value + 1}${suit}${value + 2}${suit}`)
  }

  for (const combination of combinations) {
    if (combination.indexOf('5') !== -1) {
      combinations.push(combination.replace('5', '0'))
    }
  }

  return combinations.map((combination) => `${tile}-${combination}`)
}

export default function RevealChiKeyboard({
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
      <div className="w-[12em] h-[6em] **:data-button:flex **:data-button:justify-center **:data-button:p-1 **:data-button:cursor-pointer **:data-button:hover:bg-base-200">
        <div className="grid grid-cols-3 items-start">
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
      </div>
    )
  }

  return <MJTileKeyboardMiniDiv onClick={setSelectedTile} hideJiHai />
}
