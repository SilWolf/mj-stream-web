import MJAmountSpan from '@/components/MJAmountSpan'
import React, { HTMLAttributes, useEffect, useMemo, useState } from 'react'
import {
  getLightColorOfColor,
  renderPoint,
  renderRanking,
} from '@/utils/string.util'
import { RealtimePlayer } from '@/models'
import MJTileDiv from '@/components/MJTileDiv'

import styles from './index.module.css'
import MJTileCombinationDiv from '@/components/MJTileCombinationDiv'
import useDebounce from '@/hooks/useDebounce'

type Props = HTMLAttributes<HTMLDivElement> & {
  score: number
  scoreChanges?: number[]
  point?: number
  ranking?: number
  isEast?: boolean
  isRiichi?: boolean
  isYellowCarded?: boolean
  isRedCarded?: boolean
  isRonDisallowed?: boolean
  animated?: boolean
  waitingTiles?: string[]
  waitingTileRemain?: number | null | undefined
  reveals?: string[]
  showPointAndRanking?: boolean | null

  player: RealtimePlayer
}

export default function PlayerCard({
  score,
  scoreChanges = [],
  point,
  ranking,
  isEast,
  isRiichi,
  isYellowCarded,
  isRedCarded,
  isRonDisallowed,
  waitingTiles,
  waitingTileRemain,
  reveals,
  showPointAndRanking,
  className,

  player,
  ...props
}: Props) {
  const [storedScore, setStoredScore] = useState<number>(score)
  const [storedScoreChanges, setStoredScoreChanges] = useState<number[] | null>(
    null
  )
  const debouncedWaitingTimeRemain = useDebounce(waitingTileRemain, 800)

  const lightenedColor = useMemo(
    () => getLightColorOfColor(player.color ?? '#000000'),
    [player.color]
  )

  const isScoreChanging = useMemo(
    () => !!storedScoreChanges,
    [storedScoreChanges]
  )

  useEffect(() => {
    if (score !== storedScore) {
      setStoredScoreChanges(scoreChanges)

      setTimeout(() => {
        setStoredScore(score)
      }, 2550)

      setTimeout(() => {
        setStoredScoreChanges(null)
      }, 3000)
    }
  }, [score, scoreChanges, storedScore])

  return (
    <div
      className="relative min-w-[5.35em] mx-auto [&_.hide-if-changing]:transition-opacity data-[score-changing='1']:[&_.hide-if-changing]:opacity-0 overflow-visible"
      data-score-changing={isScoreChanging ? '1' : '0'}
    >
      <div className="absolute top-[0.05em] bottom-[0.15em] -left-[0.1em] -right-[0.1em] rounded-[0.1em] overflow-hidden -z-50">
        {isYellowCarded && (
          <div className="absolute top-0 left-0 w-[200%] aspect-square animate-[yellowPenaltyAni_8s_ease-in-out_1]"></div>
        )}
        {isRedCarded && (
          <div className="absolute top-0 left-0 w-[200%] aspect-square animate-[redPenaltyAni_8s_ease-in-out_1]"></div>
        )}
      </div>

      <div className={`relative pb-5`}>
        <div className="relative flex flex-col gap-y-[0.125em] items-end justify-end min-h-[2.8em]">
          <div
            className={`${styles['riichi-sakura']} -z-1`}
            style={{
              opacity: isRiichi ? 1 : 0,
            }}
          >
            <img
              className="riichi-sakura-large"
              src="/images/riichi-sakura.png"
            />
            <img
              className="riichi-sakura-single top-0 right-0 h-4 w-4"
              src="/images/riichi-sakura-single.png"
              style={{ animationDelay: '3s' }}
            />
            <img
              className="riichi-sakura-single top-4 right-1/2 h-6 w-6"
              src="/images/riichi-sakura-single.png"
              style={{ animationDelay: '5s' }}
            />
            <img
              className="riichi-sakura-single top-10 right-1/3 h-8 w-8"
              src="/images/riichi-sakura-single.png"
              style={{ animationDelay: '2s' }}
            />
            <img
              className="riichi-sakura-single top-16 right-[60%] h-4 w-4"
              src="/images/riichi-sakura-single.png"
              style={{ animationDelay: '9s' }}
            />

            <img
              className="riichi-sakura-single top-28 right-[30%] w-18"
              src="/images/score-thousand-sakura.png"
              style={{ animationDelay: '8s' }}
            />
          </div>

          {player.propicUrl && (
            <img
              className="absolute bottom-0 left-[.125em] z-10 w-[2em] rounded-[0.08em]"
              src={player.propicUrl}
              alt={player.primaryName}
            />
          )}

          <div className="absolute bottom-full left-0 right-0">
            <div
              className="relative bg-black/50 rounded-[.125em] opacity-0 transition-opacity data-[has-reveals=true]:opacity-100 hide-if-changing overflow-visible origin-left"
              style={{
                transform:
                  reveals && reveals.length > 0
                    ? 'scale(100%, 100%)'
                    : 'scale(0, 100%)',
                transition: 'transform 1s',
              }}
              data-has-reveals={reveals && reveals.length > 0}
            >
              <div className="flex flex-row-reverse items-end justify-end flex-wrap text-[0.28em] gap-x-2 p-2">
                {reveals?.map((reveal, rI) => (
                  <div key={rI} className={styles['sakura-review-block']}>
                    <div>
                      <MJTileCombinationDiv value={reveal} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pl-[2.4em] pt-[0.125em] w-full gap-[0.125em] relative">
            <div className="relative hide-if-changing">
              <div
                className="relative rounded-[.125em] bg-black/50 opacity-0 transition-opacity data-[has-waiting-tiles='1']:opacity-100 overflow-hidden origin-left"
                style={{
                  transform:
                    waitingTiles && waitingTiles.length > 0
                      ? 'scale(100%, 100%)'
                      : 'scale(0, 100%)',
                  transition: 'transform 1s',
                }}
                data-has-waiting-tiles={
                  waitingTiles && waitingTiles.length > 0 ? '1' : '0'
                }
              >
                <div className="text-[0.5em] flex gap-x-[0.2em] p-[0.2em] pl-[0.2em] pr-[0.2em]">
                  <div className="text-[#FFFFFF] w-[2em] text-[0.4em] leading-[1.3em] flex items-center justify-center">
                    {typeof debouncedWaitingTimeRemain === 'number' ? (
                      <div className="text-center">
                        <p className="text-[1.8em]">
                          {debouncedWaitingTimeRemain}
                        </p>
                      </div>
                    ) : (
                      '待牌'
                    )}
                  </div>
                  <div className="flex-1 leading-none min-h-[1.19em] flex flex-wrap gap-[0.15em]">
                    {waitingTiles?.map((tile) => (
                      <MJTileDiv
                        key={tile}
                        className="inline-block align-bottom w-[0.85em]! animate-[fadeInFromLeft_1s_ease-in-out]"
                      >
                        {tile}
                      </MJTileDiv>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="absolute rounded-[.125em] bg-red-600/75 inset-0 flex gap-x-2 items-center justify-center opacity-0 transition-opacity duration-500 hide-if-changing cursor-pointer text-[0.3em]"
                style={{
                  opacity: isRonDisallowed ? 1 : 0,
                }}
              >
                <i className="bi bi-ban"></i> 和了禁止
              </div>
            </div>
          </div>

          <div
            className="relative self-stretch text-right ml-[6em] text-[0.4em] mr-[0.1em] leading-none text-white hide-if-changing font-semibold whitespace-nowrap"
            // style={{
            //   textShadow:
            //     '#00000048 2px 2px 3px, #00000048 -2px -2px 3px, #00000048 -2px 2px 3px, #00000048 2px -2px 3px, #00000048 0 0 6px',
            // }}
          >
            <div className="absolute z-20 top-0 left-0 bottom-0 flex gap-x-1">
              {isYellowCarded && (
                <div className="h-[1em] w-[0.75em] bg-[#ffe100] rounded-[0.05em]"></div>
              )}
              {isRedCarded && (
                <div className="h-[1em] w-[0.75em] bg-[#ff1900] rounded-[0.05em]"></div>
              )}
            </div>

            {player.primaryName}
          </div>

          <div
            className={`relative w-full text-right bg-white px-[0.1em] pb-[0.05em] ${className}`}
            {...props}
            style={{
              background: `linear-gradient(260deg, ${lightenedColor}, ${player.color}`,
              // textShadow:
              //   '#00000048 2px 2px 3px, #00000048 -2px -2px 3px, #00000048 -2px 2px 3px, #00000048 2px -2px 3px, #00000048 0 0 6px',
            }}
          >
            {storedScoreChanges && (
              <div className="absolute bottom-[1.75em] pr-[0.125em] right-0 text-[0.5625em] leading-none animate-[drop_3s_ease-in-out] font-numeric">
                {storedScoreChanges.map((scoreChange) => (
                  <div>
                    <MJAmountSpan
                      signed
                      value={scoreChange}
                      positiveClassName="text-[#09eb09]"
                      negativeClassName="text-[#eb0000]"
                    />
                  </div>
                ))}
              </div>
            )}

            <div
              className={`${styles['riichi-sakura']} z-1`}
              style={{
                opacity: isRiichi ? 1 : 0,
              }}
            >
              <img
                className="riichi-sakura-single top-0 right-0 h-8 w-8 brightness-200"
                src="/images/riichi-sakura-single.png"
                style={{ animationDelay: '3s' }}
              />
              <img
                className="riichi-sakura-single top-4 right-1/2 h-12 w-12 brightness-200"
                src="/images/riichi-sakura-single.png"
                style={{ animationDelay: '5s' }}
              />
              <img
                className="riichi-sakura-single top-10 right-1/3 h-6 w-6 brightness-200"
                src="/images/riichi-sakura-single.png"
                style={{ animationDelay: '2s' }}
              />
              <img
                className="riichi-sakura-single top-16 right-[60%] h-8 w-8 brightness-200"
                src="/images/riichi-sakura-single.png"
                style={{ animationDelay: '9s' }}
              />

              <img
                className="riichi-sakura-single top-8 right-1/2 w-36 brightness-200"
                src="/images/score-thousand-sakura.png"
                style={{ animationDelay: '5s' }}
              />
            </div>

            <div className="relative mt-[0.12em] mb-[0.03em] z-10">
              <p
                className="relative text-[0.6em] flex-1 leading-none text-white font-numeric"
                style={{
                  transition: 'opacity 1s, bottom 1s',
                  opacity: showPointAndRanking ? 0 : 1,
                  bottom: showPointAndRanking ? '1em' : 0,
                }}
              >
                <MJAmountSpan animated value={storedScore} />
              </p>
              <p
                className="absolute right-[0.25em] text-[0.6em] flex-1 leading-none text-white font-numeric space-x-4"
                style={{
                  transition: 'opacity 1s, bottom 1s',
                  opacity: showPointAndRanking ? 1 : 0,
                  bottom: showPointAndRanking ? 0 : '-1em',
                }}
              >
                <span className="text-[0.8em]">{renderPoint(point)}pt</span>
                <span className="text-[0.75em]">{renderRanking(ranking)}</span>
              </p>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-2 bg-error rounded-full transition-[left,right]"
          style={{
            left: isEast ? '0%' : '100%',
            right: isEast ? '0%' : '100%',
          }}
        ></div>
      </div>
    </div>
  )
}
