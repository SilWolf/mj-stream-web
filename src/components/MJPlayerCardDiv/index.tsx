import MJAmountSpan from '@/components/MJAmountSpan'
import React, { HTMLAttributes, useEffect, useMemo, useState } from 'react'
import { getLightColorOfColor } from '@/utils/string.util'
import { Player, PlayerIndex } from '@/models'
import MJTileDiv from '../MJTileDiv'

type Props = HTMLAttributes<HTMLDivElement> & {
  player: Partial<Player>
  playerIndex?: PlayerIndex
  score: number
  scoreChanges?: number[]
  isEast?: boolean
  isRiichi?: boolean
  animated?: boolean
  onAnimationEnd?: () => void
  waitingTiles?: string[]
  onClickWaitingTiles?: (e: React.MouseEvent) => unknown
}

export default function MJPlayerCardDiv({
  player,
  playerIndex,
  score,
  scoreChanges = [],
  isEast,
  isRiichi,
  waitingTiles,
  onClickWaitingTiles,
  className,
  ...props
}: Props) {
  const [storedScore, setStoredScore] = useState<number>(score)
  const [storedScoreChanges, setStoredScoreChanges] = useState<
    number[] | undefined
  >(undefined)

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
        setStoredScoreChanges(undefined)
      }, 3000)
    }
  }, [score, scoreChanges, storedScore])

  return (
    <div
      className="min-w-[5.35em] mx-auto [&_.hide-if-changing]:transition-opacity [&_.hide-if-changing]:data-[score-changing='1']:opacity-0"
      data-score-changing={isScoreChanging ? '1' : '0'}
    >
      <div className="flex items-end gap-x-[0.1em]">
        <div className="shrink-0 w-[1.75em] h-full relative -bottom-[0.075em] -left-[0.075em]">
          <div
            className="absolute w-full h-full bg-[#d1b571] overflow-hidden rounded-[0.08em]"
            style={{ opacity: isRiichi ? 1 : 0 }}
          >
            <div className="origin-bottom w-[200%] h-[100%] bg-[#d1291d] animate-[riichi_8s_ease-in-out_infinite]" />
          </div>

          <div className="relative z-10 w-full aspect-[90/125] p-[0.075em]">
            <div
              className="w-full h-full bg-white rounded-[0.08em] overflow-hidden"
              style={{
                background: `linear-gradient(180deg, ${player.color}, ${lightenedColor})`,
              }}
            >
              {player.teamPicUrl && (
                <div className="absolute inset-[0.075em] overflow-hidden">
                  <img
                    className="absolute max-w-[none] h-[2.2em] w-[2.2em] opacity-30 animate-[scrollFromRightToLeft_12s_linear_infinite]"
                    src={player.teamPicUrl}
                    alt={player.name}
                  />
                </div>
              )}
              {player.proPicUrl && (
                <img
                  className="relative z-10 w-full h-full rounded-[0.08em]"
                  src={player.proPicUrl}
                  alt={player.name}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-y-[0.075em] items-start justify-end">
          <div
            className="bg-black bg-opacity-60 rounded text-[0.5em] flex gap-x-[0.2em] p-[0.1em] pr-[0.2em] opacity-0 transition-opacity data-[has-waiting-tiles='1']:opacity-100 hide-if-changing cursor-pointer"
            data-has-waiting-tiles={
              (waitingTiles && waitingTiles.length > 0) || !!onClickWaitingTiles
                ? '1'
                : '0'
            }
            onClick={onClickWaitingTiles}
            data-player-index={playerIndex}
          >
            <div className="flex-1 leading-none min-h-[1.19em] flex flex-wrap gap-[0.15em]">
              {waitingTiles?.map((tile) => (
                <MJTileDiv
                  key={tile}
                  className="inline-block align-bottom w-[0.85em] animate-[fadeIn_1s_ease-in-out]"
                >
                  {tile}
                </MJTileDiv>
              ))}
            </div>
            <div className="bg-[#DDDDDD] w-px" />
            <div className="text-[#DDDDDD] text-[0.35em] leading-[1.2em] flex items-center">
              待<br />牌
            </div>
          </div>

          <div
            className={`relative w-full text-left bg-white px-[0.1em] py-[0.1em] pt-[0.08em] ${className}`}
            {...props}
            style={{
              background: `linear-gradient(260deg, transparent, transparent 22px, ${lightenedColor} 23px, ${player.color} 100%`,
            }}
          >
            <div className="flex flex-col justify-center h-[0.6em] gap-y-[0.075em]">
              <div className="text-[0.24em] ml-[0.1em] leading-none text-white hide-if-changing">
                {player.title || '　'}
              </div>
              <div className="text-[0.24em] ml-[0.1em] leading-none text-white hide-if-changing">
                {player.name}
              </div>
            </div>

            {storedScoreChanges && (
              <div className="absolute bottom-[2.25em] pr-[0.125em] left-0 text-[0.70em] leading-none animate-[drop_3s_ease-in-out] font-numeric">
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

            <div className="text-[0.70em] flex-1 leading-none text-white font-numeric mt-[0.05em]">
              <MJAmountSpan animated value={storedScore} />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`mt-[0.2em] h-[0.075em] rounded-full ${
          isEast && 'bg-red-500'
        }`}
      />
    </div>
  )
}
