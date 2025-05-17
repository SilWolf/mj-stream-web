import { CSSProperties, useMemo } from 'react'
import PlayerLargeCardInRanking from './components/PlayerLargeCardInRanking'
import useTournamentById from '@/pages/v2/services/tournament/hooks/useTournamentById'
import PlayerCardInRanking from './components/PlayerCardInRanking'

import styles from './index.module.css'

export default function PlayerRankingScreen({
  tournamentId,
}: {
  tournamentId: string | null | undefined
}) {
  const { data } = useTournamentById(tournamentId)
  const players = useMemo(
    () =>
      data?.players.toSorted(
        (a, b) => (b.statistics?.point ?? 0) - (a.statistics?.point ?? 0)
      ) ?? [],
    [data?.players]
  )

  if (!data) {
    return <></>
  }

  return (
    <div
      className={`w-full h-full flex flex-col ${styles['twr-players-ranking']}`}
    >
      <div className="flex gap-x-8 items-end">
        <div
          className="twr-players-ranking-item flex-5"
          style={
            {
              '--transition-in-delay': '0s',
              '--transition-out-delay': '0s',
            } as CSSProperties
          }
        >
          <PlayerLargeCardInRanking player={players[1]} ranking={2} />
        </div>
        <div
          className="twr-players-ranking-item flex-6 text-[1.2em]"
          style={
            {
              '--transition-in-delay': '0s',
              '--transition-out-delay': '0s',
            } as CSSProperties
          }
        >
          <PlayerLargeCardInRanking player={players[0]} ranking={1} />
        </div>
        <div
          className="twr-players-ranking-item flex-5"
          style={
            {
              '--transition-in-delay': '0s',
              '--transition-out-delay': '0s',
            } as CSSProperties
          }
        >
          <PlayerLargeCardInRanking player={players[2]} ranking={3} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 text-[0.5em] mt-8">
        <div className="space-y-4">
          {players.slice(3, 10).map((player, index) => (
            <div
              key={player.id}
              className="twr-players-ranking-item"
              style={
                {
                  '--transition-in-delay': `${((index + 1) * 0.08).toFixed(2)}s`,
                  '--transition-out-delay': `0s`,
                } as CSSProperties
              }
            >
              <PlayerCardInRanking player={player} ranking={index + 4} />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {players.slice(10, 16).map((player, index) => (
            <div
              key={player.id}
              className="twr-players-ranking-item"
              style={
                {
                  '--transition-in-delay': `${((index + 4) * 0.08).toFixed(2)}s`,
                  '--transition-out-delay': `0s`,
                } as CSSProperties
              }
            >
              <PlayerCardInRanking player={player} ranking={index + 11} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
