import React from 'react'
import useRealtimeMatch from '@/hooks/useRealtimeMatch'
import { PlayerIndex } from '@/models'
import { getIsPlayerEast } from '@/helpers/mahjong.helper'
import MJPlayerCardDiv from '@/components/MJPlayerCardDiv'
import MJTileDiv from '@/components/MJTileDiv'
import MJMatchCounterSpan from '@/components/MJMatchCounterSpan'
import MJMatchHistoryTable from '@/components/MJMatchHistoryTable'

type Props = {
  params: { matchId: string }
}

export default function MatchControlPage({ params: { matchId } }: Props) {
  const {
    rtMatch,
    rtMatchRounds,
    rtMatchCurrentRound,
    rtMatchCurrentRoundDoras,
  } = useRealtimeMatch(matchId)

  if (!rtMatch || !rtMatchCurrentRound) {
    return <div>對局讀取失敗。</div>
  }

  return (
    <div>
      <div className="container mx-auto my-8 px-8 space-y-6">
        <div className="flex flex-row items-stretch gap-x-4 text-white">
          <div className="shrink-0 rounded-[1rem] bg-black bg-opacity-50 p-2 flex items-stretch gap-x-4">
            <div className="text-[2.5rem] leading-none border-[.25rem] rounded-[.75rem] pb-[0.3em] pt-[0.2em] px-4 border-current flex items-center justify-center">
              <MJMatchCounterSpan
                roundCount={rtMatchCurrentRound.roundCount}
                max={8}
              />
            </div>
            <div className="flex flex-col justify-around">
              <div className="flex-1 flex flex-row items-center gap-x-2">
                <div className="flex-1">
                  <img
                    src="/mj-stream-web/images/score-hundred.png"
                    alt="hundred"
                    className="h-4"
                  />
                </div>
                <div>{rtMatchCurrentRound.extendedRoundCount ?? 0}</div>
              </div>
              <div className="flex-1 flex flex-row items-center gap-x-2">
                <div className="flex-1">
                  <img
                    src="/mj-stream-web/images/score-thousand.png"
                    alt="thousand"
                    className="h-4"
                  />
                </div>
                <div>{rtMatchCurrentRound.cumulatedThousands ?? 0}</div>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              {rtMatchCurrentRoundDoras.map((dora, index) => (
                <MJTileDiv
                  key={dora}
                  className="w-9 cursor-pointer"
                  data-index={index}
                >
                  {dora}
                </MJTileDiv>
              ))}
            </div>
          </div>
          <div className="flex-1" />
        </div>

        <div className="space-y-4">
          {(['0', '1', '2', '3'] as PlayerIndex[]).map((index) => (
            <div className="flex gap-x-2 items-center">
              <div className="flex-1 text-[2.5rem]">
                <MJPlayerCardDiv
                  player={rtMatch.players[index]}
                  playerIndex="0"
                  score={rtMatchCurrentRound.playerResults[index].beforeScore}
                  scoreChanges={
                    rtMatchCurrentRound.playerResults[index].prevScoreChanges
                  }
                  isEast={getIsPlayerEast(
                    index,
                    rtMatchCurrentRound.roundCount
                  )}
                  isRiichi={rtMatchCurrentRound.playerResults[index].isRiichi}
                  isYellowCarded={
                    rtMatchCurrentRound.playerResults[index].isYellowCarded
                  }
                  isRedCarded={
                    rtMatchCurrentRound.playerResults[index].isRedCarded
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <MJMatchHistoryTable
          players={rtMatch.players}
          matchRounds={rtMatchRounds}
          className="w-full table-auto"
        />
      </div>
    </div>
  )
}
