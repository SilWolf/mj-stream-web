import React, { useEffect, useMemo, useState } from 'react'
import MJMatchCounterSpan from '@/components/MJMatchCounterSpan'
import MJTileDiv from '@/components/MJTileDiv'
import useRealtimeMatch from '@/hooks/useRealtimeMatch'

import { PlayerIndex, RoundResultTypeEnum } from '@/models'
import {
  convertScoresToPointsAndRankings,
  getIsPlayerEast,
} from '@/helpers/mahjong.helper'
import MJPlayerCardDiv from '@/components/MJPlayerCardDiv'
import MJHanFuTextSpecialSpan from '@/components/MJHanFuTextSpecialSpan'
import MJReachAnimationDiv from '@/components/MJReachAnimationDiv'

type Props = {
  params: { matchId: string }
}

export default function MatchDetailPage({ params: { matchId } }: Props) {
  const { rtMatch, rtMatchCurrentRound, rtMatchCurrentRoundDoras } =
    useRealtimeMatch(matchId)

  const players = useMemo(() => {
    if (!rtMatch || !rtMatchCurrentRound) {
      return []
    }

    const pointsAndRankings = convertScoresToPointsAndRankings([
      rtMatchCurrentRound.playerResults[0].afterScore,
      rtMatchCurrentRound.playerResults[1].afterScore,
      rtMatchCurrentRound.playerResults[2].afterScore,
      rtMatchCurrentRound.playerResults[3].afterScore,
    ])

    return (['0', '1', '2', '3'] as PlayerIndex[]).map((index, nIndex) => ({
      ...rtMatch.players[index],
      color: rtMatch.players[index].color,
      currentStatus: {
        ...rtMatchCurrentRound.playerResults[index],
        isEast: getIsPlayerEast(index, rtMatchCurrentRound.roundCount),
        ...pointsAndRankings[nIndex],
      },
    }))
  }, [rtMatch, rtMatchCurrentRound])

  const [currentRiichiPlayerIndex, setCurrentRiichiPlayerIndex] =
    useState<PlayerIndex | null>(null)
  const [storedRoundCode, setStoredRoundCode] = useState<string>()
  const [riichiMap, setRiichiMap] = useState<Record<PlayerIndex, boolean>>({
    '0': false,
    '1': false,
    '2': false,
    '3': false,
  })

  useEffect(() => {
    ;(['0', '1', '2', '3'] as PlayerIndex[]).forEach((index) => {
      if (
        typeof rtMatchCurrentRound?.playerResults[index].isRiichi !==
          'undefined' &&
        rtMatchCurrentRound.playerResults[index].isRiichi !== riichiMap[index]
      ) {
        if (rtMatchCurrentRound.playerResults[index].isRiichi === true) {
          setCurrentRiichiPlayerIndex(index)
          setTimeout(() => {
            setCurrentRiichiPlayerIndex(null)
          }, 2800)
        }
        setRiichiMap((prev) => ({
          ...prev,
          [index]: rtMatchCurrentRound.playerResults[index].isRiichi,
        }))
      }
    })
  }, [rtMatchCurrentRound?.playerResults, riichiMap])

  useEffect(() => {
    if (storedRoundCode !== rtMatchCurrentRound?.code) {
      setStoredRoundCode(rtMatchCurrentRound?.code)
      setRiichiMap({
        '0': false,
        '1': false,
        '2': false,
        '3': false,
      })
    }
  }, [rtMatchCurrentRound?.code, storedRoundCode])

  if (!rtMatch || !rtMatchCurrentRound) {
    return <div className="text-current">對局讀取失敗。</div>
  }

  return (
    <>
      <div
        className={
          'absolute inset-0 mx-auto py-8 overflow-hidden text-[4.8rem] transition-opacity'
        }
        style={{
          background:
            'linear-gradient(transparent, transparent 73%, rgba(0, 0, 0, 0.4))',
          opacity: currentRiichiPlayerIndex !== null ? 0 : 1,
        }}
      >
        <div className="flex flex-row items-stretch gap-x-4 text-white">
          <div
            className="relative text-[0.6em] p-2 pl-10 pr-[1em] flex items-center gap-x-8"
            style={{
              transition: 'width 0.3s, left 1.5s, opacity 1.5s',
              left: rtMatch.hideHeader ? '-100%' : '0',
              opacity: rtMatch.hideHeader ? '0' : '1',
              background: `linear-gradient(280deg, transparent, transparent 0.5em, #00000080 0.5em, #00000080 100%)`,
            }}
          >
            <div className="">
              <div className="text-[0.5em]">{rtMatch.name}</div>
              <div className="flex gap-x-8 items-center">
                <div className="min-w-[3.5em]">
                  <MJMatchCounterSpan
                    roundCount={rtMatchCurrentRound.roundCount}
                    max={8}
                  />
                </div>

                <div className="flex flex-col justify-around gap-2">
                  <div className="flex-1 flex flex-row items-center gap-x-3">
                    <div className="flex-1">
                      <img
                        src="/images/score-hundred.png"
                        alt="hundred"
                        className="h-[0.25em] mt-[0.1em]"
                      />
                    </div>
                    <div className="text-[0.45em] leading-none">
                      {rtMatchCurrentRound.extendedRoundCount ?? 0}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-row items-center gap-x-3">
                    <div className="flex-1">
                      <img
                        src="/images/score-thousand.png"
                        alt="thousand"
                        className="h-[0.25em] mt-[0.1em]"
                      />
                    </div>
                    <div className="text-[0.45em] leading-none">
                      {rtMatchCurrentRound.cumulatedThousands ?? 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              {rtMatchCurrentRoundDoras.map((dora) => (
                <MJTileDiv
                  key={dora}
                  className="w-[1.4em]! animate-[fadeInFromLeft_0.5s_ease-in-out]"
                >
                  {dora}
                </MJTileDiv>
              ))}
            </div>
          </div>
          <div className="flex-1" />
        </div>

        <div className="flex items-center justify-center mt-20">
          <div className="body-hidden mx-20 text-[16px]">
            {/* <OBSInstructionDiv matchId={matchId} /> */}
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 px-10 pb-6 grid grid-cols-4 items-end gap-x-8 text-white animate-[fadeInFromBottom_1s_ease-in-out]"
          style={{
            opacity: rtMatch.activeResultDetail || rtMatch.hidePlayers ? 0 : 1,
            bottom:
              rtMatch.activeResultDetail || rtMatch.hidePlayers ? '-150px' : 0,
            transition: 'opacity 0.5s, bottom 0.5s',
          }}
        >
          {players.map((player) => (
            <div className="w-[5.35em]" key={player.primaryName}>
              <MJPlayerCardDiv
                player={player}
                playerIndex={'0'}
                score={player.currentStatus.afterScore}
                scoreChanges={player.currentStatus.scoreChanges}
                isEast={player.currentStatus.isEast}
                isRiichi={
                  player.currentStatus.isRiichi &&
                  rtMatchCurrentRound.resultType === RoundResultTypeEnum.Unknown
                }
                waitingTiles={
                  rtMatchCurrentRound.resultType === RoundResultTypeEnum.Unknown
                    ? player.currentStatus.waitingTiles
                    : []
                }
                isYellowCarded={player.currentStatus.isYellowCarded}
                isRedCarded={player.currentStatus.isRedCarded}
                isRonDisallowed={player.currentStatus.isRonDisallowed}
                ranking={player.currentStatus.ranking}
                point={player.currentStatus.point}
                showPointAndRanking={!!rtMatch.showPoints}
              />
              <img src={player.largeLogoUrl as string} className="w-0 h-0" />
            </div>
          ))}
        </div>

        {rtMatch.activeResultDetail && (
          <div className="absolute bottom-0 left-0 right-0 px-10 pb-6 grid grid-cols-4 gap-x-8 text-white transition-opacity animate-[fadeInFromBottom_1s_ease-in-out]">
            <div className="w-[5.35em]">
              <MJPlayerCardDiv
                player={
                  rtMatch.players[rtMatch.activeResultDetail.winnerPlayerIndex]
                }
                playerIndex="0"
                score={
                  rtMatchCurrentRound.playerResults[
                    rtMatch.activeResultDetail.winnerPlayerIndex
                  ].afterScore
                }
              />
            </div>
            <div className="col-span-3 bg-black/50 py-6 px-8 text-[0.5em] flex items-stretch gap-x-4">
              <div
                className={`flex-1 flex flex-wrap gap-x-[0.75em] ${
                  rtMatch.activeResultDetail.yakumanCount > 0
                    ? 'self-center justify-center'
                    : ''
                }`}
              >
                {rtMatch.activeResultDetail.yakus.map(({ label }) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
              <div className="shrink-0 w-px bg-neutral-200"></div>
              <div className="shrink-0 min-w-[3em] self-center text-green-400 text-[1.4em] text-center">
                <MJHanFuTextSpecialSpan
                  han={rtMatch.activeResultDetail.han}
                  fu={rtMatch.activeResultDetail.fu}
                  yakumanCount={rtMatch.activeResultDetail.yakumanCount}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none">
        <MJReachAnimationDiv
          active={currentRiichiPlayerIndex !== null}
          color={
            currentRiichiPlayerIndex && players[currentRiichiPlayerIndex].color
          }
          largeLogoUrl={
            currentRiichiPlayerIndex &&
            players[currentRiichiPlayerIndex].largeLogoUrl
          }
        />
      </div>
    </>
  )
}
