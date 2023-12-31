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
  isYellowCarded?: boolean
  isRedCarded?: boolean
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
  isYellowCarded,
  isRedCarded,
  waitingTiles,
  onClickWaitingTiles,
  className,
  ...props
}: Props) {
  const [storedScore, setStoredScore] = useState<number>(score)
  const [storedScoreChanges, setStoredScoreChanges] = useState<number[] | null>(
    null
  )

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
      className="relative min-w-[5.35em] mx-auto [&_.hide-if-changing]:transition-opacity [&_.hide-if-changing]:data-[score-changing='1']:opacity-0 overflow-visible"
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
      {isYellowCarded && (
        <div className="absolute -top-[0.4em] left-0 h-[0.5em] w-[0.37em] bg-[#ffe100] rounded-[0.05em]"></div>
      )}
      {isRedCarded && (
        <div className="absolute -top-[0.4em] left-[0.45em] h-[0.5em] w-[0.37em] bg-[#ff1900] rounded-[0.05em]"></div>
      )}
      <div className="flex items-end gap-x-[0.1em]">
        <div className="shrink-0 w-[1.75em] h-full relative -bottom-[0.085em] -left-[0.085em]">
          <div
            className="absolute w-full h-full bg-[#d1b571] overflow-hidden rounded-[0.1em]"
            style={{ opacity: isRiichi ? 1 : 0 }}
          >
            <div className="origin-bottom w-[200%] h-[100%] bg-[#d1291d] animate-[riichi_8s_ease-in-out_infinite]" />
          </div>

          <div className="relative z-10 w-full aspect-[90/125] p-[0.085em]">
            <div
              className="w-full h-full bg-white rounded-[0.08em] overflow-hidden"
              style={{
                background: `linear-gradient(180deg, ${player.color}, ${lightenedColor})`,
              }}
            >
              {player.teamPicUrl && (
                <div className="absolute inset-[0.085em] overflow-hidden">
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
              {player.nickname && (
                <div className="absolute bottom-[0.085em] left-[0.085em] right-[0.085em] rounded-b-[0.08em] bg-[linear-gradient(to_top,#00000060,#00000050_70%,transparent)] text-white z-20">
                  <p className="text-center text-[0.25em] font-semibold pb-[0.25em] pt-[0.5em]">
                    {player.nickname}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-y-[0.125em] items-start justify-end">
          <div
            className="bg-black bg-opacity-60 rounded text-[0.5em] flex gap-x-[0.2em] p-[0.1em] pl-[0.2em] pr-[0.2em] opacity-0 transition-opacity data-[has-waiting-tiles='1']:opacity-100 hide-if-changing cursor-pointer"
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
                  className="inline-block align-bottom w-[0.85em] animate-[fadeInFromLeft_1s_ease-in-out]"
                >
                  {tile}
                </MJTileDiv>
              ))}
            </div>
            <div className="bg-[#FFFFFF] w-[4px]" />
            <div className="text-[#FFFFFF] text-[0.4em] leading-[1.3em] flex items-center">
              待<br />牌
            </div>
          </div>

          <div
            className={`relative w-full text-left bg-white px-[0.1em] pb-[0.05em] pt-[0.08em] ${className}`}
            {...props}
            style={{
              background: `linear-gradient(260deg, transparent, transparent 22px, ${lightenedColor} 23px, ${player.color} 100%`,
            }}
          >
            <div className="flex flex-col justify-center gap-y-[0.075em] mt-[0.04em]">
              <div className="text-[0.1875em] ml-[0.1em] leading-none text-white hide-if-changing font-semibold">
                {player.title || '　'}
              </div>
              <div className="text-[0.3125em] ml-[0.1em] leading-none text-white hide-if-changing font-semibold">
                {player.name}
              </div>
            </div>

            {storedScoreChanges && (
              <div className="absolute bottom-[2.75em] pr-[0.125em] left-0 text-[0.5625em] leading-none animate-[drop_3s_ease-in-out] font-numeric">
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

            <div className="mt-[0.12em] mb-[0.03em]">
              <p className="text-[0.5625em] flex-1 leading-none text-white font-numeric">
                <MJAmountSpan animated value={storedScore} />
              </p>
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
