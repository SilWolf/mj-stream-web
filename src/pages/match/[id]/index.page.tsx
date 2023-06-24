import React from 'react'
import useMatch from '@/hooks/useMatch'
import { PlayerIndex } from '@/models'
import { getIsPlayerEast } from '@/helpers/mahjong.helper'
import MJPlayerCardDiv, {
  MJPlayerCardMainColorMap,
} from '@/components/MJPlayerCardDiv'
import MJTileDiv from '@/components/MJTileDiv'
import MJMatchCounterSpan from '@/components/MJMatchCounterSpan'
import MJMatchHistoryTable from '@/components/MJMatchHistoryTable'

type Props = {
  params: { matchId: string }
}

export default function MatchControlPage({ params: { matchId } }: Props) {
  const { match, matchCurrentRound, matchCurrentRoundDoras } = useMatch(matchId)

  if (!match || !matchCurrentRound) {
    return <div>對局讀取失敗。</div>
  }

  return (
    <div>
      <div className="container mx-auto my-8 px-8 space-y-6">
        <div className="flex flex-row items-stretch gap-x-4 text-white">
          <div className="shrink-0 rounded-[1rem] bg-black bg-opacity-50 p-2 flex items-stretch gap-x-4">
            <div className="font-ud text-[2.5rem] border-[.25rem] rounded-[.75rem] px-4 border-current flex items-center justify-center">
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
                <div className="font-ud">
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
                <div className="font-ud">
                  {matchCurrentRound.cumulatedThousands ?? 0}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              {matchCurrentRoundDoras.map((dora, index) => (
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
              </div>
            </div>
          ))}
        </div>

        <MJMatchHistoryTable matchId={matchId} className="w-full table-auto" />
      </div>
    </div>
  )
}
