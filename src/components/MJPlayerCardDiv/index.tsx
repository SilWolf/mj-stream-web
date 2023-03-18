/* eslint-disable react/jsx-props-no-spreading */
import MJAmountSpan from '@/components/MJAmountSpan'
import { isSameArray } from '@/utils/array.util'
import React, { HTMLAttributes, useEffect, useState } from 'react'
import { useBoolean } from 'react-use'

type Props = HTMLAttributes<HTMLDivElement> & {
  propicSrc?: string
  name: string
  score: number
  scoreChanges?: number[]
  isEast?: boolean
  onAnimationEnd?: () => void
}

export default function MJPlayerCardDiv({
  propicSrc,
  name,
  score,
  scoreChanges = [],
  isEast,
  className,
  ...props
}: Props) {
  const [storedScore, setStoredScore] = useState<number>(score)
  const [storedScoreChanges, setStoredScoreChanges] = useState<
    number[] | undefined
  >(undefined)

  useEffect(() => {
    if (score !== storedScore) {
      setStoredScoreChanges(scoreChanges)

      setTimeout(() => {
        setStoredScore(score)
      }, 2550)

      setTimeout(() => {
        setStoredScoreChanges(undefined)
      }, 3000)
    }
  }, [score, scoreChanges, storedScore])

  return (
    <div>
      <div className="relative">
        <div className="w-[1.5em] h-full absolute bottom-0 left-0 pl-[0.125em] pb-[0.125em]">
          <div className="w-full h-full bg-white bg-opacity-50 rounded-[0.125em]">
            {propicSrc && <img src={propicSrc} alt={name} />}
          </div>
        </div>
        <div className="flex flex-col gap-y-[0.125em] items-end justify-end">
          <div className="h-[0.25em]" />
          <div className="text-[0.375em] leading-none pr-[0.45em]">{name}</div>
          <div
            className={`relative w-full text-right bg-white bg-opacity-60 rounded-[0.125em] pl-[2.5em] pr-[0.125em] ${className}`}
            {...props}
          >
            {storedScoreChanges && (
              <div className="absolute bottom-[1.8em] pr-[0.125em] right-0 font-ud text-[1em] leading-none animate-[drop_3s_ease-in-out]">
                {storedScoreChanges.map((scoreChange) => (
                  <div>
                    <MJAmountSpan
                      signed
                      value={scoreChange}
                      positiveClassName="text-green-400"
                      negativeClassName="text-red-400"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="font-ud flex-1 text-[1em] leading-none">
              <MJAmountSpan animated value={storedScore} />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`mt-[0.125em] h-[0.125em] rounded-full ${
          isEast && 'bg-red-400'
        }`}
      />
    </div>
  )
}

MJPlayerCardDiv.defaultProps = {
  propicSrc: '',
  isEast: false,
}
