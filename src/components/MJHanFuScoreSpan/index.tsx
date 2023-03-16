import { MJCompiledScore } from '@/helpers/mahjong.helper'
import React, { useMemo } from 'react'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  score: MJCompiledScore
}

export default function MJHanFuScoreSpan({ score, ...props }: Props) {
  const scoreDisplay = useMemo(() => {
    if (!score) {
      return '(錯誤)'
    }

    if (score.target) {
      return score.target
    }

    if (score.all) {
      return `${score.all} ALL`
    }

    return `${score.others},${score.east}`
  }, [score])

  return <div {...props}>{scoreDisplay}</div>
}
