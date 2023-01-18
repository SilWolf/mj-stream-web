import React from 'react'
import MJMatchCounterSpan from '@/components/MJMatchCounterSpan'
import MJTileDiv from '@/components/MJTileDiv'
import useMatch from '@/hooks/useMatch'
import BroadcastLayout from '@/layouts/Broadcast.layout'

import { PlayerIndex } from '@/models'
import PlayerCardDiv from './components/PlayerCardDiv'
import OBSInstructionDiv from './components/OBSInstructionDiv'

const PLAYER_CARD_CLASSNAME_MAP: Record<PlayerIndex, string> = {
  0: '!bg-blue-400',
  1: '!bg-red-400',
  2: '!bg-green-400',
  3: '!bg-yellow-400',
}

type Props = {
  params: { matchId: string }
}

export default function MatchDetailPage({ params: { matchId } }: Props) {
  const { match, matchActiveRound } = useMatch(matchId)

  if (!match || !matchActiveRound) {
    return (
      <BroadcastLayout>
        <div className="text-current">對局讀取失敗。</div>
        <OBSInstructionDiv />
      </BroadcastLayout>
    )
  }

  return (
    <BroadcastLayout>
      <div className="flex flex-row items-stretch gap-x-4 text-white">
        <div className="rounded-[1rem] bg-black bg-opacity-50 p-2 flex items-stretch gap-x-4">
          <div className="font-ud text-[2.5rem] leading-[3rem] border-[.25rem] rounded-[.75rem] px-4 border-current">
            <MJMatchCounterSpan roundCount={matchActiveRound.roundCount} />
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
              <div className="font-ud">
                {matchActiveRound.subRoundCount ?? 0}
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
              <div className="font-ud">
                {matchActiveRound.cumulatedThousands ?? 0}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-x-2">
            {matchActiveRound.doras.map((dora) => (
              <MJTileDiv key={dora} className="w-9">
                {dora}
              </MJTileDiv>
            ))}
          </div>
        </div>
        <div className="flex-1" />
      </div>

      <OBSInstructionDiv />

      <div className="flex flex-row items-end justify-center gap-x-8 text-white text-[4rem]">
        {([0, 1, 2, 3] as PlayerIndex[]).map((index) => (
          <PlayerCardDiv
            name={match.players[index].name}
            title={match.players[index].title}
            score={matchActiveRound.playerResults[index].beforeScore}
            isEast={matchActiveRound.roundCount % 4 === (index + 1) % 4}
            className={`${PLAYER_CARD_CLASSNAME_MAP[index]} !bg-opacity-60`}
          />
        ))}
      </div>
    </BroadcastLayout>
  )
}
