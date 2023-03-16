/* eslint-disable react/jsx-props-no-spreading */
import React, { HTMLAttributes, useMemo } from 'react'

type Props = HTMLAttributes<HTMLSpanElement> & {
  roundCount: number
  subRoundCount?: number
}

const ROUND_MAP: Record<string, string> = {
  1: '東1局',
  2: '東2局',
  3: '東3局',
  4: '東4局',
  5: '南1局',
  6: '南2局',
  7: '南3局',
  8: '南4局',
  9: '西1局',
  10: '西2局',
  11: '西3局',
  12: '西4局',
  13: '北1局',
  14: '北2局',
  15: '北3局',
  16: '北4局',
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
