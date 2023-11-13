import React, { useMemo } from 'react'
import MJMatchCounterSpan from '@/components/MJMatchCounterSpan'
import MJTileDiv from '@/components/MJTileDiv'
import useMatch from '@/hooks/useMatch'
import BroadcastLayout from '@/layouts/Broadcast.layout'

import { PlayerIndex } from '@/models'
import { getIsPlayerEast } from '@/helpers/mahjong.helper'
import MJPlayerCardDiv from '@/components/MJPlayerCardDiv'
import OBSInstructionDiv from './components/OBSInstructionDiv'

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

  if (!match || !matchCurrentRound) {
    return (
      <BroadcastLayout>
        <div className="text-current">對局讀取失敗。</div>
      </BroadcastLayout>
    )
  }

  return (
    <BroadcastLayout>
      <div className="flex flex-row items-stretch gap-x-4 text-white">
        <div
          className="p-2 pl-10 pr-10 flex items-center gap-x-8 transition-[width]"
          style={{
            background: `linear-gradient(280deg, transparent, transparent 22px, #00000080 23px, #00000080 100%)`,
          }}
        >
          <div className="text-[0.5em]">
            <div className="text-[0.5em]">1/11/2000 第一回戰</div>
            <div className="flex gap-x-8 items-center">
              <div>
                <MJMatchCounterSpan
                  roundCount={matchCurrentRound.roundCount}
                  max={8}
                />
              </div>

              <div className="flex flex-col justify-around">
                <div className="flex-1 flex flex-row items-center gap-x-3">
                  <div className="flex-1">
                    <img
                      src="/images/score-hundred.png"
                      alt="hundred"
                      className="h-2"
                    />
                  </div>
                  <div className="text-[0.4em] pb-1.5 leading-none">
                    {matchCurrentRound.extendedRoundCount ?? 0}
                  </div>
                </div>
                <div className="flex-1 flex flex-row items-center gap-x-3">
                  <div className="flex-1">
                    <img
                      src="/images/score-thousand.png"
                      alt="thousand"
                      className="h-2"
                    />
                  </div>
                  <div className="text-[0.4em] pb-1.5 leading-none">
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
                className="w-14 animate-[fadeIn_0.5s_ease-in-out]"
              >
                {dora}
              </MJTileDiv>
            ))}
          </div>
        </div>
        <div className="flex-1" />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="body-hidden mx-20 text-[16px]">
          <OBSInstructionDiv matchId={matchId} />
        </div>
      </div>

      <div className="flex flex-row items-end justify-center gap-x-8 text-white px-10">
        {players.map((player) => (
          <MJPlayerCardDiv
            key={player.name}
            player={player}
            score={player.currentStatus.afterScore}
            scoreChanges={player.currentStatus.scoreChanges}
            isEast={player.currentStatus.isEast}
            isRiichi={player.currentStatus.isRiichi}
          />
        ))}
      </div>
    </BroadcastLayout>
  )
}
