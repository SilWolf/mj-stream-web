import React, { useEffect, useMemo, useState } from 'react'
import MJMatchCounterSpan from '@/components/MJMatchCounterSpan'
import MJTileDiv from '@/components/MJTileDiv'
import useMatch from '@/hooks/useMatch'

import { PlayerIndex } from '@/models'
import { getIsPlayerEast } from '@/helpers/mahjong.helper'
import MJPlayerCardDiv from '@/components/MJPlayerCardDiv'
import OBSInstructionDiv from './components/OBSInstructionDiv'
import MJHanFuTextSpecialSpan from '@/components/MJHanFuTextSpecialSpan'
import MJReachAnimationDiv from '@/components/MJReachAnimationDiv'

type Props = {
  params: { matchId: string }
}

export default function MatchDetailPage({ params: { matchId } }: Props) {
  const { match, matchCurrentRound, matchCurrentRoundDoras } = useMatch(matchId)

  const players = useMemo(() => {
    if (!match || !matchCurrentRound) {
      return []
    }

    return (['0', '1', '2', '3'] as PlayerIndex[]).map((index) => ({
      ...match.players[index],
      color: match.players[index].color,
      currentStatus: {
        ...matchCurrentRound.playerResults[index],
        isEast: getIsPlayerEast(index, matchCurrentRound.roundCount),
      },
    }))
  }, [match, matchCurrentRound])

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
    // eslint-disable-next-line no-extra-semi
    ;(['0', '1', '2', '3'] as PlayerIndex[]).forEach((index) => {
      if (
        typeof matchCurrentRound?.playerResults[index].isRiichi !==
          'undefined' &&
        matchCurrentRound.playerResults[index].isRiichi !== riichiMap[index]
      ) {
        if (matchCurrentRound.playerResults[index].isRiichi === true) {
          setCurrentRiichiPlayerIndex(index)
          setTimeout(() => {
            setCurrentRiichiPlayerIndex(null)
          }, 2800)
        }
        setRiichiMap((prev) => ({
          ...prev,
          [index]: matchCurrentRound.playerResults[index].isRiichi,
        }))
      }
    })
  }, [matchCurrentRound?.playerResults, riichiMap])

  useEffect(() => {
    if (storedRoundCode !== matchCurrentRound?.code) {
      setStoredRoundCode(matchCurrentRound?.code)
      setRiichiMap({
        '0': false,
        '1': false,
        '2': false,
        '3': false,
      })
    }
  }, [matchCurrentRound?.code, storedRoundCode])

  if (!match || !matchCurrentRound) {
    return <div className="text-current">對局讀取失敗。</div>
  }

  return (
    <>
      <div
        className={
          'w-screen h-screen mx-auto py-8 overflow-hidden text-[4.8rem] transition-opacity'
        }
        style={{
          background:
            'linear-gradient(transparent, transparent 73%, rgba(0, 0, 0, 0.25))',
          opacity: currentRiichiPlayerIndex !== null ? 0 : 1,
        }}
      >
        <div className="flex flex-row items-stretch gap-x-4 text-white">
          <div
            className="text-[0.6em] p-2 pl-10 pr-[1em] flex items-center gap-x-8 transition-[width]"
            style={{
              background: `linear-gradient(280deg, transparent, transparent 0.5em, #00000080 0.5em, #00000080 100%)`,
            }}
          >
            <div className="">
              <div className="text-[0.5em]">{match.name}</div>
              <div className="flex gap-x-8 items-center">
                <div className="min-w-[3.5em]">
                  <MJMatchCounterSpan
                    roundCount={matchCurrentRound.roundCount}
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
                      {matchCurrentRound.extendedRoundCount ?? 0}
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
                      {matchCurrentRound.cumulatedThousands ?? 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              {matchCurrentRoundDoras.map((dora) => (
                <MJTileDiv
                  key={dora}
                  className="w-[1.4em] animate-[fadeInFromLeft_0.5s_ease-in-out]"
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
            <OBSInstructionDiv matchId={matchId} />
          </div>
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 px-10 pb-6 grid grid-cols-4 items-end gap-x-8 text-white transition-opacity animate-[fadeInFromBottom_1s_ease-in-out]"
          style={{
            opacity: match.activeResultDetail ? 0 : 'inherit',
          }}
        >
          {players.map((player) => (
            <div className="w-[5.35em]" key={player.name}>
              <MJPlayerCardDiv
                player={player}
                score={player.currentStatus.afterScore}
                scoreChanges={player.currentStatus.scoreChanges}
                isEast={player.currentStatus.isEast}
                isRiichi={player.currentStatus.isRiichi}
                waitingTiles={player.currentStatus.waitingTiles}
              />
              <img src={player.largeTeamPicUrl as string} className="w-0 h-0" />
            </div>
          ))}
        </div>

        {match.activeResultDetail && (
          <div className="fixed bottom-0 left-0 right-0 px-10 pb-6 grid grid-cols-4 gap-x-8 text-white transition-opacity animate-[fadeInFromBottom_1s_ease-in-out]">
            <div className="w-[5.35em]">
              <MJPlayerCardDiv
                player={
                  match.players[match.activeResultDetail.winnerPlayerIndex]
                }
                score={
                  matchCurrentRound.playerResults[
                    match.activeResultDetail.winnerPlayerIndex
                  ].afterScore
                }
              />
            </div>
            <div className="col-span-3 bg-black bg-opacity-50 py-6 px-8 text-[0.5em] flex items-stretch gap-x-4">
              <div
                className={`flex-1 flex flex-wrap gap-x-[0.75em] ${
                  match.activeResultDetail.isYakuman
                    ? 'self-center justify-center'
                    : ''
                }`}
              >
                {match.activeResultDetail.yakusInText.map((text) => (
                  <span key={text}>{text}</span>
                ))}
              </div>
              <div className="shrink-0 w-px bg-neutral-200"></div>
              <div className="shrink-0 min-w-[3em] self-center text-green-400 text-[1.4em] text-center">
                <MJHanFuTextSpecialSpan
                  han={Math.min(
                    match.activeResultDetail.isYakuman ? 13 : 12,
                    match.activeResultDetail.han
                  )}
                  fu={match.activeResultDetail.fu}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed inset-0 pointer-events-none">
        <MJReachAnimationDiv
          active={currentRiichiPlayerIndex !== null}
          color={
            currentRiichiPlayerIndex && players[currentRiichiPlayerIndex].color
          }
          largeTeamPicUrl={
            currentRiichiPlayerIndex &&
            players[currentRiichiPlayerIndex].largeTeamPicUrl
          }
        />
      </div>
    </>
  )
}
