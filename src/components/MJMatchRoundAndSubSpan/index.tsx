/* eslint-disable react/jsx-props-no-spreading */
import React, { HTMLAttributes, useMemo } from 'react'

type Props = HTMLAttributes<HTMLSpanElement>

const ROUND_MAP: Record<string, string> = {
  1: '東一局',
  2: '東二局',
  3: '東三局',
  4: '東四局',
  5: '南一局',
  6: '南二局',
  7: '南三局',
  8: '南四局',
  9: '西一局',
  10: '西二局',
  11: '西三局',
  12: '西四局',
  13: '北一局',
  14: '北二局',
  15: '北三局',
  16: '北四局',
}

export default function MJMatchRoundAndSubSpan({ children, ...props }: Props) {
  const selfChildren = useMemo(() => {
    try {
      const text = children?.toString()
      if (!text) {
        throw new Error(
          `children=${children} is undefined in MJMatchRoundAndSubSpan`
        )
      }

      const [round, sub = ''] = children?.toString().split('.') ?? []
      const roundText = ROUND_MAP[round]
      if (!roundText) {
        throw new Error(
          `Unable to parse round=${round} in MJMatchRoundAndSubSpan`
        )
      }

      return sub ? `${roundText}${sub}本場` : roundText
    } catch (e) {
      console.error(e)
      return children
    }
  }, [children])

  return <span {...props}>{selfChildren}</span>
}
