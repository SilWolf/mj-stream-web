/* eslint-disable react/jsx-props-no-spreading */
import { generateMatchRoundText } from '@/helpers/mahjong.helper'
import React, { HTMLAttributes, useMemo } from 'react'

type Props = HTMLAttributes<HTMLSpanElement> & {
  roundCount: number
  extendedRoundCount?: number
  max?: number
}

export default function MJMatchCounterSpan({
  roundCount,
  extendedRoundCount,
  max = 16,
  ...props
}: Props) {
  const selfChildren = useMemo(
    () => generateMatchRoundText(roundCount, extendedRoundCount ?? 0, max),
    [roundCount, max, extendedRoundCount]
  )

  return <span {...props}>{selfChildren}</span>
}

MJMatchCounterSpan.defaultProps = {
  extendedRoundCount: 0,
}
