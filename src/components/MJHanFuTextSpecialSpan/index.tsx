import React, { useMemo } from 'react'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  han: number
  fu: number | undefined
}

export default function MJHanFuTextSpecialSpan({ han, fu, ...props }: Props) {
  const specialNameDisplay = useMemo(() => {
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
    } else if (han >= 3 && typeof fu !== 'undefined' && fu >= 70) {
      return '滿貫'
    } else if (typeof fu !== 'undefined') {
      return undefined
    }

    return undefined
  }, [han, fu])

  if (specialNameDisplay) {
    return <div {...props}>{specialNameDisplay}</div>
  }

  return (
    <div {...props}>
      <div className="flex justify-between">
        <span>{han}</span>
        <span>飜</span>
      </div>
      <div className="flex justify-between">
        <span>{fu}</span>
        <span>符</span>
      </div>
    </div>
  )
}
