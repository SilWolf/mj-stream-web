/* eslint-disable react/jsx-props-no-spreading */
import React, { HTMLAttributes, useMemo } from 'react'

type Props = HTMLAttributes<HTMLSpanElement> & {
  roundCount: number
  subRoundCount?: number
}

const ROUND_MAP: Record<string, string> = {
  1: '東１局',
  2: '東２局',
  3: '東３局',
  4: '東４局',
  5: '南１局',
  6: '南２局',
  7: '南３局',
  8: '南４局',
  9: '西１局',
  10: '西２局',
  11: '西３局',
  12: '西４局',
  13: '北１局',
  14: '北２局',
  15: '北３局',
  16: '北４局',
}

export default function MJMatchCounterSpan({
  roundCount,
  subRoundCount,
  ...props
}: Props) {
  const selfChildren = useMemo(() => {
    try {
      const roundText = ROUND_MAP[roundCount]
      if (!roundText) {
        throw new Error(
          `Unable to parse roundCount=${roundCount} in MJMatchCounterSpan`
        )
      }

      return subRoundCount && subRoundCount !== 0
        ? `${roundText}${subRoundCount}本場`
        : roundText
    } catch (e) {
      console.error(e)
      return `${roundCount}.${subRoundCount ?? 0}`
    }
  }, [roundCount, subRoundCount])

  return <span {...props}>{selfChildren}</span>
}

MJMatchCounterSpan.defaultProps = {
  subRoundCount: 0,
}
