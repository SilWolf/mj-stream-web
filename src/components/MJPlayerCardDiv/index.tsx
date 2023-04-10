/* eslint-disable react/jsx-props-no-spreading */
import MJAmountSpan from '@/components/MJAmountSpan'
import React, { HTMLAttributes, useEffect, useState } from 'react'
import { PlayerIndex } from '@/models'
import MJRiichiBgDiv from '../MJRiichiBgDiv'

type Props = HTMLAttributes<HTMLDivElement> & {
  propicSrc?: string
  title?: string
  name: string
  score: number
  scoreChanges?: number[]
  isEast?: boolean
  isRiichi?: boolean
  onAnimationEnd?: () => void
  mainColor?: string
}

export const MJPlayerCardMainColorMap: Record<PlayerIndex, string> = {
  '0': '#6700cf',
  '1': '#00b5de',
  '2': '#e3277b',
  '3': '#03ada5',
}

export default function MJPlayerCardDiv({
  propicSrc,
  title,
  name,
  score,
  scoreChanges = [],
  isEast,
  isRiichi,
  mainColor = '#ffffff',
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
        <div className="w-[1.75em] h-full absolute -bottom-[0.075em] left-0 z-10">
          {isRiichi && (
            <MJRiichiBgDiv className="w-full h-full rounded-[0.125em] overflow-hidden" />
          )}
          <div className="absolute bottom-0 left-0 w-full h-full pr-[0.075em] pb-[0.075em]">
            <div
              className="w-full h-full bg-white rounded-[0.125em]"
              style={{ background: mainColor }}
            >
              {propicSrc && (
                <img
                  className="w-full h-full rounded-[0.125em]"
                  src={propicSrc}
                  alt={name}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-[0.125em] items-end justify-end min-h-[2.2em]">
          <div className="text-[0.3em] leading-none pr-[0.45em]">
            {title ?? ' '}
          </div>
          <div className="text-[0.375em] leading-none pr-[0.45em]">{name}</div>
          <div
            className={`relative w-full text-right bg-white  min-w-[5.5em] pr-[0.125em] rounded-bl-lg ${className}`}
            {...props}
            style={{
              background: `linear-gradient(to right, #ffffff, ${mainColor})`,
            }}
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
            <div className="font-ud flex-1 text-[1em] leading-none text-white">
              <MJAmountSpan animated value={storedScore} />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`mt-[0.125em] h-[0.125em] rounded-full ${
          isEast && 'bg-red-500'
        }`}
      />
    </div>
  )
}

MJPlayerCardDiv.defaultProps = {
  propicSrc: '',
  isEast: false,
}
