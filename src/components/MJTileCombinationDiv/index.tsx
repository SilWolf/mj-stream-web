import React, { useMemo } from 'react'
import { TILE_H, TILE_W } from '../MJTileDiv'
import MJTileV2Div from '../MJTileV2Div'

type TilePlacement = {
  tile: string
  x: number
  y: number
  isRotate: boolean
}

export const parseTileString = (s: string): [TilePlacement[], number] => {
  const tileMatches = [...s.matchAll(/(\d[mpsz])(a?)([-=]?)(\s*)/g)]
  const tilePlacements: TilePlacement[] = []

  let x = 0.0

  for (let i = 0; i < tileMatches.length; i++) {
    const tileMatch = tileMatches[i]

    tilePlacements.push({
      tile: tileMatch[1],
      x: tileMatch[3] === '=' ? x - TILE_H : x,
      y: tileMatch[3] === '=' ? TILE_W : 0,
      isRotate: tileMatch[3] === '-' || tileMatch[3] === '=',
    })

    if (tileMatch[3] === '-') {
      x += TILE_H
    } else if (!tileMatch[3]) {
      x += TILE_W
    }

    x += (tileMatch[4].length || 0) * 0.2 * TILE_W
  }

  return [tilePlacements, x]
}

export default function MJTileCombinationDiv({ value }: { value: string }) {
  const [tilePlacements, width] = useMemo(() => parseTileString(value), [value])

  return (
    <div
      className="relative overflow-visible"
      style={{ width: `${width}em`, height: `${TILE_H}em` }}
    >
      {tilePlacements.map(({ tile, x, y, isRotate }) => (
        <MJTileV2Div
          value={tile}
          style={{
            position: 'absolute',
            left: `${(isRotate ? x + TILE_H : x).toFixed(1)}em`,
            bottom: `${y.toFixed(1)}em`,
            transform: isRotate ? 'rotate(-90deg)' : 'none',
          }}
        />
      ))}
    </div>
  )
}
