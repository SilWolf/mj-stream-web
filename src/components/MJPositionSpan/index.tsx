/* eslint-disable react/jsx-props-no-spreading */
import { PlayerIndex } from '@/models'
import React, { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLSpanElement> & {
  playerIndex: PlayerIndex
}

const PLAYER_INDEX_POSITION_MAP: Record<PlayerIndex, string> = {
  '0': '東',
  '1': '南',
  '2': '西',
  '3': '北',
}

export default function MJPositionSpan({ playerIndex, ...props }: Props) {
  return <span {...props}>{PLAYER_INDEX_POSITION_MAP[playerIndex]}</span>
}
