import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MJTileDiv, { MJTileKey } from '../MJTileDiv'
import { arrayToObject } from '@/utils/object.util'

const tileGroups: MJTileKey[][] = [
  ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m'],
  ['1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p'],
  ['1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s'],
  ['1z', '2z', '3z', '4z', '5z', '6z', '7z'],
]

const getDefaultTilesMap = () => arrayToObject(tileGroups.flat(2), 0)

type Props = {
  onSubmit?: (tileKeys: MJTileKey[], isFuriten: boolean) => void
  onRemove?: () => void
  canRemove?: boolean
  defaultValue?: string[] | undefined
}

export default function MJTileKeyboardForWaitingTileDiv({
  onSubmit,
  onRemove,
  canRemove,
  defaultValue,
}: Props) {
  const [selectedTileKeysMap, setSelectedTileKeysMap] =
    useState<Record<MJTileKey, number>>(getDefaultTilesMap())
  const lastClickedTile = useRef<string>('')

  const selectedTiles = useMemo(
    () =>
      Object.entries(selectedTileKeysMap)
        .filter(([, status]) => typeof status === 'number' && status !== 0)
        .map(([key, status]) => (key + (status === 2 ? '#' : '')) as MJTileKey),
    [selectedTileKeysMap]
  )

  const handleClickTile = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const tileKey = e.currentTarget?.getAttribute('data-key') as MJTileKey
      if (typeof selectedTileKeysMap[tileKey] !== 'undefined') {
        let newStatus = 0
        if (lastClickedTile.current === tileKey) {
          newStatus = (selectedTileKeysMap[tileKey] + 1) % 3
        } else {
          newStatus = selectedTileKeysMap[tileKey] !== 0 ? 0 : 1
        }

        setSelectedTileKeysMap((prev) => {
          prev[tileKey] = newStatus
          return { ...prev }
        })

        lastClickedTile.current = tileKey
      }
    },
    [selectedTileKeysMap]
  )

  const handleClickSubmitWithFuriten = useCallback(() => {
    if (selectedTiles.length > 0 && onSubmit) {
      onSubmit?.(selectedTiles, true)
      setSelectedTileKeysMap(getDefaultTilesMap())
    }
  }, [onSubmit, selectedTiles])

  const handleClickSubmit = useCallback(() => {
    if (selectedTiles.length > 0 && onSubmit) {
      onSubmit?.(selectedTiles, false)
      setSelectedTileKeysMap(getDefaultTilesMap())
    }
  }, [onSubmit, selectedTiles])

  const handleClickRemove = useCallback(() => {
    if (canRemove) {
      onRemove?.()
      setSelectedTileKeysMap(getDefaultTilesMap())
    }
  }, [canRemove, onRemove])

  useEffect(() => {
    if (defaultValue) {
      const newMap = getDefaultTilesMap()
      for (const key of defaultValue) {
        const tileKey = (key[0] + key[1]) as MJTileKey
        newMap[tileKey] = key[2] === '#' ? 2 : 1
      }

      setSelectedTileKeysMap(newMap)
    }
  }, [defaultValue])

  return (
    <div>
      {canRemove && (
        <div className="mb-4">
          <button
            className="btn btn-sm btn-outline"
            type="button"
            onClick={handleClickRemove}
          >
            移除全部聽牌
          </button>
        </div>
      )}
      <div className="mb-4 grid grid-cols-9 gap-1 lg:gap-x-2 lg:gap-y-4 items-center text-center">
        {tileGroups.map((tileGroup) =>
          tileGroup.map((tileKey: MJTileKey) => (
            <button
              type="button"
              onClick={handleClickTile}
              data-key={tileKey}
              data-status={selectedTileKeysMap[tileKey]}
              className="cursor-pointer opacity-100 data-[status=0]:opacity-50 data-[status=1]:bg-green-500 data-[status=2]:bg-gray-500"
            >
              <div className="opacity-60">
                <MJTileDiv>{tileKey}</MJTileDiv>
              </div>
            </button>
          ))
        )}
      </div>
      <div className="flex gap-x-4">
        <div className="flex-2">
          <button
            className="btn btn-warning w-full"
            type="button"
            onClick={handleClickSubmitWithFuriten}
            disabled={selectedTiles.length === 0}
          >
            <i className="bi bi-exclamation-diamond"></i> 振聽聽牌
          </button>
        </div>
        <div className="flex-3">
          <button
            className="btn btn-primary w-full"
            type="button"
            onClick={handleClickSubmit}
            disabled={selectedTiles.length === 0}
          >
            確定
          </button>
        </div>
      </div>
    </div>
  )
}
