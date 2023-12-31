import React, { useMemo } from 'react'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  han: number
  fu: number | undefined
  yakumanCount?: number
  raw?: boolean
  twoRows?: boolean
  isManganRoundUp?: boolean
}

export default function MJHanFuTextSpan({
  han,
  fu,
  yakumanCount,
  raw,
  isManganRoundUp,
  ...props
}: Props) {
  const hanFuDisplay = useMemo(() => {
    if (yakumanCount && yakumanCount > 0) {
      if (yakumanCount === 1) {
        return '役滿'
      } else if (yakumanCount === 2) {
        return '兩倍役滿'
      } else if (yakumanCount === 3) {
        return '三倍役滿'
      } else if (yakumanCount === 4) {
        return '四倍役滿'
      } else {
        return `${yakumanCount}倍役滿`
      }
    }

    if (raw) {
      if (typeof fu !== 'undefined' && han <= 4) {
        return `${han}飜${fu}符`
      }

      return `${han}飜`
    }

    if (han >= 11) {
      return '三倍滿'
    } else if (han >= 8) {
      return '倍滿'
    } else if (han >= 6) {
      return '跳滿'
    } else if (han >= 5) {
      return '滿貫'
    } else if (
      han >= 4 &&
      typeof fu !== 'undefined' &&
      (fu >= 40 || (isManganRoundUp && fu >= 30))
    ) {
      return '滿貫'
    } else if (
      han >= 3 &&
      typeof fu !== 'undefined' &&
      (fu >= 70 || (isManganRoundUp && fu >= 60))
    ) {
      return '滿貫'
    } else if (typeof fu !== 'undefined') {
      return `${han}飜${fu}符`
    }

    return `${han}飜`
  }, [yakumanCount, raw, han, fu, isManganRoundUp])

  return <div {...props}>{hanFuDisplay}</div>
}
