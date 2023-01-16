/* eslint-disable react/jsx-props-no-spreading */
import React, { HTMLAttributes, useMemo } from 'react'

type Props = HTMLAttributes<HTMLSpanElement>

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

export default function MJMatchCounterSpan({ children, ...props }: Props) {
  const selfChildren = useMemo(() => {
    try {
      const text = children?.toString()
      if (!text) {
        throw new Error(
          `children=${children} is undefined in MJMatchCounterSpan`
        )
      }

      const [round, sub = ''] = children?.toString().split('.') ?? []
      const roundText = ROUND_MAP[round]
      if (!roundText) {
        throw new Error(`Unable to parse round=${round} in MJMatchCounterSpan`)
      }

      return sub && sub !== '0' ? `${roundText}${sub}本場` : roundText
    } catch (e) {
      console.error(e)
      return children
    }
  }, [children])

  return <span {...props}>{selfChildren}</span>
}
