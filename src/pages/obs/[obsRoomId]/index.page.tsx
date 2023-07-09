import React, { useMemo } from 'react'
import MJMatchCounterSpan from '@/components/MJMatchCounterSpan'
import MJTileDiv from '@/components/MJTileDiv'
import useMatch from '@/hooks/useMatch'
import BroadcastLayout from '@/layouts/Broadcast.layout'

import { PlayerIndex } from '@/models'
import { getIsPlayerEast } from '@/helpers/mahjong.helper'
import MJPlayerCardDiv from '@/components/MJPlayerCardDiv'
import { useFirebaseDatabaseByKey } from '@/providers/firebaseDatabase.provider'
import OBSInstructionDiv from '../components/OBSInstructionDiv'

type Props = {
  params: { obsRoomId: string }
}

export default function ObsPage({ params: { obsRoomId } }: Props) {
  const { data: obsInfo } = useFirebaseDatabaseByKey<string>(`obs/${obsRoomId}`)

  const { match, matchCurrentRound, matchCurrentRoundDoras } = useMatch(
    obsInfo?.matchId ?? ''
  )

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
        <div className="rounded-[1rem] bg-black bg-opacity-50 p-2 pr-4 flex items-stretch gap-x-6 transition-[width]">
          <div className="text-[4rem] leading-none border-[.35rem] rounded-[.75rem] px-6 pt-[0.05em] pb-[0.2em] border-current flex items-center justify-center">
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
                  className="h-5"
                />
              </div>
              <div className="text-[2.2rem] pb-1.5 leading-none">
                {matchCurrentRound.extendedRoundCount ?? 0}
              </div>
            </div>
            <div className="flex-1 flex flex-row items-center gap-x-3">
              <div className="flex-1">
                <img
                  src="/images/score-thousand.png"
                  alt="thousand"
                  className="h-5"
                />
              </div>
              <div className="text-[2.2rem] pb-1.5 leading-none">
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
          <OBSInstructionDiv />
        </div>
      </div>

      <div className="flex flex-row items-end justify-center gap-x-8 text-white text-[4.8rem]">
        {players.map((player) => (
          <MJPlayerCardDiv
            key={player.name}
            name={player.name}
            title={player.title}
            propicSrc={player.propicSrc}
            color={player.color}
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
