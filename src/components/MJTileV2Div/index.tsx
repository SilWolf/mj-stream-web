import React, { HTMLAttributes, useMemo } from 'react'

export type MJTileKey =
  | '1m'
  | '2m'
  | '3m'
  | '4m'
  | '5m'
  | '6m'
  | '7m'
  | '8m'
  | '9m'
  | '0m'
  | '1p'
  | '2p'
  | '3p'
  | '4p'
  | '5p'
  | '6p'
  | '7p'
  | '8p'
  | '9p'
  | '0p'
  | '1s'
  | '2s'
  | '3s'
  | '4s'
  | '5s'
  | '6s'
  | '7s'
  | '8s'
  | '9s'
  | '0s'
  | '1z'
  | '2z'
  | '3z'
  | '4z'
  | '5z'
  | '6z'
  | '7z'

const TILE_CLASS_MAP: Record<MJTileKey | 'default', string> = {
  '1m': 'bg-[left_0%_top_0%]',
  '2m': 'bg-[left_10%_top_0%]',
  '3m': 'bg-[left_20%_top_0%]',
  '4m': 'bg-[left_30%_top_0%]',
  '5m': 'bg-[left_40%_top_0%]',
  '6m': 'bg-[left_50%_top_0%]',
  '7m': 'bg-[left_60%_top_0%]',
  '8m': 'bg-[left_70%_top_0%]',
  '9m': 'bg-[left_80%_top_0%]',
  '0m': 'bg-[left_30%_top_80%]',
  '1p': 'bg-[left_0%_top_20%]',
  '2p': 'bg-[left_10%_top_20%]',
  '3p': 'bg-[left_20%_top_20%]',
  '4p': 'bg-[left_30%_top_20%]',
  '5p': 'bg-[left_40%_top_20%]',
  '6p': 'bg-[left_50%_top_20%]',
  '7p': 'bg-[left_60%_top_20%]',
  '8p': 'bg-[left_70%_top_20%]',
  '9p': 'bg-[left_80%_top_20%]',
  '0p': 'bg-[left_40%_top_80%]',
  '1s': 'bg-[left_0%_top_40%]',
  '2s': 'bg-[left_10%_top_40%]',
  '3s': 'bg-[left_20%_top_40%]',
  '4s': 'bg-[left_30%_top_40%]',
  '5s': 'bg-[left_40%_top_40%]',
  '6s': 'bg-[left_50%_top_40%]',
  '7s': 'bg-[left_60%_top_40%]',
  '8s': 'bg-[left_70%_top_40%]',
  '9s': 'bg-[left_80%_top_40%]',
  '0s': 'bg-[left_50%_top_80%]',
  '1z': 'bg-[left_0%_top_60%]',
  '2z': 'bg-[left_10%_top_60%]',
  '3z': 'bg-[left_20%_top_60%]',
  '4z': 'bg-[left_30%_top_60%]',
  '5z': 'bg-[left_40%_top_60%]',
  '6z': 'bg-[left_50%_top_60%]',
  '7z': 'bg-[left_60%_top_60%]',
  default: 'bg-[left_70%_top_60%]',
}

type Props = HTMLAttributes<HTMLSpanElement>

export const TILE_W = 1.0
export const TILE_H = 1.4

export default function MJTileV2Div({
  className,
  value,
  ...props
}: Props & { value: string }) {
  const tileClassName = useMemo(
    () =>
      TILE_CLASS_MAP[value?.toString() as MJTileKey] ?? TILE_CLASS_MAP.default,
    [value]
  )

  return <div className={`mahjong-tile-v2 ${tileClassName}`} {...props} />
}
