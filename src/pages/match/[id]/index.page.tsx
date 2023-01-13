import React from 'react'
import MJMatchCounterSpan from '@/components/MJMatchCounterSpan'
import MJTileDiv from '@/components/MJTileDiv'
import useMatch from '@/hooks/useMatch'
import BroadcastLayout from '@/layouts/Broadcast.layout'

import PlayerCardDiv from './components/PlayerCardDiv'
import OBSInstructionDiv from './components/OBSInstructionDiv'

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
        <div className="text-[4rem] border-[.25rem] rounded-[1rem] px-4 border-current bg-black bg-opacity-20">
          <MJMatchCounterSpan>{matchActiveRound.counter}</MJMatchCounterSpan>
        </div>
        <div className="rounded-[1rem] bg-black bg-opacity-60 pl-2 pr-4 flex items-center gap-x-2">
          <div style={{ writingMode: 'vertical-rl' }}>懸賞</div>
          <div className="h-[55%] w-[2px] mr-2 bg-white bg-opacity-50" />
          <div>
            {matchActiveRound.doras.map((dora) => (
              <MJTileDiv key={dora} className="w-[3rem]">
                {dora}
              </MJTileDiv>
            ))}
          </div>
        </div>
        <div className="flex-1" />
      </div>

      <OBSInstructionDiv />

      <div className="flex flex-row items-end justify-center gap-x-8 text-white">
        <PlayerCardDiv
          name={match.players[0].name}
          score={matchActiveRound.playerResults[0].beforeScore}
          className="!bg-blue-400 !bg-opacity-60"
        />
        <PlayerCardDiv
          name={match.players[1].name}
          score={matchActiveRound.playerResults[1].beforeScore}
          className="!bg-red-400 !bg-opacity-60"
        />
        <PlayerCardDiv
          name={match.players[2].name}
          score={matchActiveRound.playerResults[2].beforeScore}
          className="!bg-green-400 !bg-opacity-60"
        />
        <PlayerCardDiv
          name={match.players[3].name}
          score={matchActiveRound.playerResults[3].beforeScore}
          className="!bg-yellow-400 !bg-opacity-60"
        />
      </div>
    </BroadcastLayout>
  )
}
