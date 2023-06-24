import React from 'react'
import MJMatchCounterSpan from '@/components/MJMatchCounterSpan'
import MJTileDiv from '@/components/MJTileDiv'
import useMatch from '@/hooks/useMatch'
import BroadcastLayout from '@/layouts/Broadcast.layout'

import { PlayerIndex } from '@/models'
import { getIsPlayerEast } from '@/helpers/mahjong.helper'
import MJPlayerCardDiv, {
  MJPlayerCardMainColorMap,
} from '@/components/MJPlayerCardDiv'
import OBSInstructionDiv from './components/OBSInstructionDiv'

type Props = {
  params: { matchId: string }
}

export default function MatchDetailPage({ params: { matchId } }: Props) {
  const { match, matchCurrentRound, matchCurrentRoundDoras } = useMatch(matchId)

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
        <div className="rounded-[1rem] bg-black bg-opacity-50 p-2 pr-4 flex items-stretch gap-x-6 transition-[width]">
          <div className="font-ud text-[4.5rem] leading-[5rem] border-[.35rem] rounded-[.75rem] px-8 border-current">
            <MJMatchCounterSpan
              roundCount={matchCurrentRound.roundCount}
              max={8}
            />
          </div>

          <div className="flex flex-col justify-around">
            <div className="flex-1 flex flex-row items-center gap-x-2">
              <div className="flex-1">
                <img
                  src="/images/score-hundred.png"
                  alt="hundred"
                  className="h-4"
                />
              </div>
              <div className="font-ud text-[1.2rem]">
                {matchCurrentRound.extendedRoundCount ?? 0}
              </div>
            </div>
            <div className="flex-1 flex flex-row items-center gap-x-2">
              <div className="flex-1">
                <img
                  src="/images/score-thousand.png"
                  alt="thousand"
                  className="h-4"
                />
              </div>
              <div className="font-ud text-[1.2rem]">
                {matchCurrentRound.cumulatedThousands ?? 0}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-x-3">
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
        <div className="body-hidden mx-20">
          <OBSInstructionDiv matchId={matchId} />
        </div>
      </div>

      <div className="flex flex-row items-end justify-center gap-x-8 text-white text-[4.8rem]">
        {(['0', '1', '2', '3'] as PlayerIndex[]).map((index) => (
          <MJPlayerCardDiv
            key={index}
            name={match.players[index].name}
            title={match.players[index].title}
            propicSrc={match.players[index].propicSrc}
            score={matchCurrentRound.playerResults[index].beforeScore}
            scoreChanges={
              matchCurrentRound.playerResults[index].prevScoreChanges
            }
            isEast={getIsPlayerEast(index, matchCurrentRound.roundCount)}
            isRiichi={matchCurrentRound.playerResults[index].isRiichi}
            color={MJPlayerCardMainColorMap[index]}
          />
        ))}
      </div>
    </BroadcastLayout>
  )
}
