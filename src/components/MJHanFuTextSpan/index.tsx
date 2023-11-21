import React, { useMemo } from 'react'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  han: number
  fu: number | undefined
  raw?: boolean
  twoRows?: boolean
}

export default function MJHanFuTextSpan({ han, fu, raw, ...props }: Props) {
  const hanFuDisplay = useMemo(() => {
    if (raw) {
      if (typeof fu !== 'undefined' && han <= 4) {
        return `${han}飜${fu}符`
      }

      return `${han}飜`
    }

    if (han >= 13) {
      return '役滿'
    } else if (han >= 11) {
      return '三倍滿'
    } else if (han >= 8) {
      return '倍滿'
    } else if (han >= 6) {
      return '跳滿'
    } else if (han >= 5) {
      return '滿貫'
    } else if (han >= 4 && typeof fu !== 'undefined' && fu >= 40) {
      return '滿貫'
    } else if (han >= 3 && typeof fu !== 'undefined' && fu >= 30) {
      return '滿貫'
    } else if (typeof fu !== 'undefined') {
      return `${han}飜${fu}符`
    }

    return `${han}飜`
  }, [han, fu, raw])

  return <div {...props}>{hanFuDisplay}</div>
}
