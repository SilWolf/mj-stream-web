import { getIsPlayerEast } from '@/helpers/mahjong.helper'
import useRealtimeMatch from '@/hooks/useRealtimeMatch'
import { RealtimePlayer, PlayerIndex, PlayerResult } from '@/models'
import { useMemo } from 'react'

const PlayerHand = ({
  player,
}: {
  player: RealtimePlayer & { currentStatus: PlayerResult }
}) => {
  return (
    <div
      className="relative w-full h-full border-[.5em]"
      style={{
        borderColor: player.color,
      }}
    >
      <div
        className="absolute top-0 left-0 flex gap-x-8 pr-1 rounded-br-lg text-[1.5em] font-semibold text-white"
        style={{
          backgroundColor: player.color,
        }}
      >
        <p>
          {player.primaryName} ({player.nickname})
        </p>
        <p>{player.currentStatus.afterScore}</p>
      </div>
    </div>
  )
}

type Props = {
  params: { matchId: string }
}

const MatchOverviewOverlayPage = ({ params: { matchId } }: Props) => {
  const { rtMatch, rtMatchCurrentRound } = useRealtimeMatch(matchId)

  const players = useMemo(() => {
    if (!rtMatch || !rtMatchCurrentRound) {
      return []
    }

    const rankings = [
      { ranking: 1, point: 50.0 },
      { ranking: 2, point: 10.0 },
      { ranking: 3, point: -10.0 },
      { ranking: 4, point: -30.0 },
    ]

    const playersRanking = Object.entries(rtMatchCurrentRound.playerResults)
      .map(([key, value]) => ({
        playerIndex: key,
        score: value.afterScore,
      }))
      .sort((a, b) => b.score - a.score)
      .map((value, i) => ({
        playerIndex: value.playerIndex,
        ...rankings[i],
        point: (value.score - 30000) / 1000.0 + rankings[i].point,
      }))
      .reduce(
        (prev, curr) => {
          prev[curr.playerIndex] = {
            point: curr.point,
            ranking: curr.ranking,
          }

          return prev
        },
        {} as Record<string, { point: number; ranking: number }>
      )

    return (['0', '1', '2', '3'] as PlayerIndex[]).map((index) => ({
      ...rtMatch.players[index],
      color: rtMatch.players[index].color,
      currentStatus: {
        ...rtMatchCurrentRound.playerResults[index],
        isEast: getIsPlayerEast(index, rtMatchCurrentRound.roundCount),
        ...playersRanking[index],
      },
    }))
  }, [rtMatch, rtMatchCurrentRound])

  if (!rtMatch || players.length === 0) {
    return <></>
  }

  return (
    <div className="absolute inset-0 grid grid-cols-8">
      <div className="col-span-5">
        <PlayerHand player={players[0]} />
      </div>
      <div className="col-span-1"></div>
      <div className="col-span-2"></div>

      <div className="col-span-5">
        <PlayerHand player={players[1]} />
      </div>
      <div className="col-span-1"></div>
      <div className="col-span-1"></div>
      <div className="col-span-1"></div>

      <div className="col-span-5">
        <PlayerHand player={players[2]} />
      </div>
      <div className="col-span-3 row-span-2"></div>

      <div className="col-span-5">
        <PlayerHand player={players[3]} />
      </div>
    </div>
  )
}

export default MatchOverviewOverlayPage
