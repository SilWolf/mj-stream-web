import { getScoreByHanAndFu, MJCompiledScore } from '@/helpers/mahjong.helper'
import React, { useCallback, useEffect, useState } from 'react'
import MJUISelect from '../MJUI/MJUISelect'

type Props = {
  isEast: boolean
  isRon: boolean
  onChangeScore?: (newScore: MJCompiledScore) => void
}

export default function MJHanFuScoreSelect({
  isEast,
  isRon,
  onChangeScore,
}: Props) {
  const [han, setHan] = useState<string>('1')
  const [fu, setFu] = useState<string>('30')

  useEffect(() => {
    if (!onChangeScore) {
      return
    }

    const score = getScoreByHanAndFu(han, fu)
    if (!score) {
      return
    }

    if (isEast) {
      if (isRon) {
        onChangeScore({ win: score.er, target: score.er })
      } else {
        onChangeScore({ win: score.e * 3, all: score.e })
      }
    } else if (isRon) {
      onChangeScore({ win: score.ner, target: score.ner })
    } else {
      onChangeScore({
        win: score.e + 2 * score.ne,
        east: score.e,
        others: score.ne,
      })
    }
  }, [fu, han, isEast, isRon, onChangeScore])

  const handleChangeHan = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.currentTarget.value
      setHan(newValue)
    },
    []
  )

  const handleChangeFu = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.currentTarget.value
      setFu(newValue)
    },
    []
  )

  return (
    <div>
      <div className="flex gap-x-4">
        <div className="flex-1">
          <MJUISelect className="w-full" value={han} onChange={handleChangeHan}>
            <option value={1}>1番</option>
            <option value={2}>2番</option>
            <option value={3}>3番</option>
            <option value={4}>4番</option>
            <option value={5}>5番</option>
            <option value={6}>6番</option>
            <option value={7}>7番</option>
            <option value={8}>8番</option>
            <option value={9}>9番</option>
            <option value={10}>10番</option>
            <option value={11}>11番</option>
            <option value={12}>12番</option>
            <option value={13}>累計役滿</option>
          </MJUISelect>
        </div>
        <div className="flex-1">
          <MJUISelect className="w-full" value={fu} onChange={handleChangeFu}>
            <option value={20}>20符</option>
            <option value={25}>25符</option>
            <option value={30}>30符</option>
            <option value={40}>40符</option>
            <option value={50}>50符</option>
            <option value={60}>60符</option>
            <option value={70}>70符</option>
            <option value={80}>80符</option>
            <option value={90}>90符</option>
            <option value={100}>100符</option>
            <option value={110}>110符</option>
          </MJUISelect>
        </div>
      </div>
    </div>
  )
}
