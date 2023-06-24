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
  color?: string
}

export default function MJPlayerCardDiv({
  propicSrc,
  title,
  name,
  score,
  scoreChanges = [],
  isEast,
  isRiichi,
  color = '#ffffff',
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
        <div className="w-[1.75em] h-full absolute -bottom-[0.075em] -left-[0.075em] z-10">
          <div className="absolute bottom-0 left-0 w-full aspect-[554/792] p-[0.075em]">
            <div
              className="w-full h-full bg-white rounded-[0.3em]"
              style={{ background: color }}
            >
              {isRiichi && (
                <MJRiichiBgDiv className="absolute -z-10 w-full h-full top-0 left-0 rounded-[0.3em] overflow-hidden" />
              )}
              {propicSrc && (
                <img
                  className="w-full h-full rounded-[0.3em]"
                  src={propicSrc}
                  alt={name}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-[0.125em] items-end justify-end min-h-[2.2em]">
          <div
            className={`text-right transition-opacity duration-700 ${
              storedScoreChanges ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="mb-2 text-[0.3em] leading-none">{title ?? ' '}</div>
            <div className="text-[0.5em] leading-none">{name}</div>
          </div>

          <div
            className={`relative w-full text-right bg-white  min-w-[5.5em] py-1 pr-[0.125em] rounded-bl-[0.3em] ${className}`}
            {...props}
            style={{
              background: `linear-gradient(to right, #ffffff, ${color})`,
            }}
          >
            {storedScoreChanges && (
              <div className="absolute bottom-[1.8em] pr-[0.125em] right-0 text-[1em] leading-none animate-[drop_3s_ease-in-out]">
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
            <div className="text-[0.9em] flex-1 leading-none pb-[0.15em] text-white">
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
