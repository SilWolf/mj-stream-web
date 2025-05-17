import useTournamentById from '@/pages/v2/services/tournament/hooks/useTournamentById'
import { CSSProperties, useMemo } from 'react'

import styles from './index.module.css'
import PlayerCardInRanking from './components/PlayerCardInRanking'

export default function PlayersStatRankingScreen({
  tournamentId,
}: {
  tournamentId: string | null | undefined
}) {
  const { data } = useTournamentById(tournamentId)
  const [
    highestPointPlayers,
    highestRonPPlayers,
    highestRonPureScoreAvgPlayers,
    lowestChuckPPlayers,
    highestScoreMax,
  ] = useMemo(() => {
    const filteredPlayers = (data?.players ?? []).filter(
      (player) =>
        typeof player.statistics?.matchCount !== 'undefined' &&
        player.statistics.matchCount > 0
    )

    return [
      filteredPlayers
        .toSorted(
          (a, b) => (b.statistics?.point ?? 0) - (a.statistics?.point ?? 0)
        )
        .slice(0, 6) ?? [],
      filteredPlayers
        .toSorted(
          (a, b) => (b.statistics?.ronP ?? 0) - (a.statistics?.ronP ?? 0)
        )
        .slice(0, 6) ?? [],
      filteredPlayers
        .toSorted(
          (a, b) =>
            (b.statistics?.ronPureScoreAvg ?? 0) -
            (a.statistics?.ronPureScoreAvg ?? 0)
        )
        .slice(0, 6) ?? [],
      filteredPlayers
        .toSorted(
          (a, b) => (a.statistics?.chuckP ?? 0) - (b.statistics?.chuckP ?? 0)
        )
        .slice(0, 6) ?? [],
      filteredPlayers
        .toSorted(
          (a, b) =>
            (b.statistics?.scoreMax ?? 0) - (a.statistics?.scoreMax ?? 0)
        )
        .slice(0, 6) ?? [],
    ]
  }, [data?.players])

  return (
    <div
      className={`w-full h-full flex gap-[1em] items-stretch ${styles['twr-player-ranking']}`}
    >
      <div className="flex-1 flex flex-col gap-y-1 gap-y-[.5em]">
        <h4 className="text-[2em] font-semibold text-center leading-[1em] twr-player-ranking-row">
          MVP
        </h4>
        <p className="text-center twr-player-ranking-row">積分最高選手</p>
        <div className="flex-1 flex flex-col gap-y-1 text-[0.5em] gap-y-[1em]">
          {highestPointPlayers.map((player, index) => (
            <div
              key={player.id}
              className="twr-player-ranking-row"
              style={
                {
                  '--transition-in-delay': `${index * 0.05}s`,
                } as CSSProperties
              }
            >
              <PlayerCardInRanking
                key={player.id}
                player={player}
                ranking={index + 1}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-[1em] twr-player-ranking-row">
        <div className="space-y-[.5em]">
          <p className="text-center">和了率</p>
          <div className="flex-1 flex flex-col gap-y-1">
            {highestRonPPlayers.map((player) => (
              <div
                key={player.id}
                className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center text-white rounded-lg"
                style={{
                  background: `${player.color.primary}C0`,
                }}
              >
                <div className="flex items-center justify-between px-[.5em] gap-x-[.5em] py-[.25em]">
                  <div className="flex-1">
                    <p className="leading-[1.2em]">
                      {player.name.display.primary}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="leading-[1.2em]">
                      {player.statistics?.ronP?.toFixed(2) ?? '0.00'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-[.5em]">
          <p className="text-center">平均打點</p>
          <div className="flex-1 flex flex-col gap-y-1">
            {highestRonPureScoreAvgPlayers.map((player) => (
              <div
                key={player.id}
                className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center text-white rounded-lg"
                style={{
                  background: `${player.color.primary}C0`,
                }}
              >
                <div className="flex items-center justify-between px-[.5em] gap-x-[.5em] py-[.25em]">
                  <div className="flex-1">
                    <p className="leading-[1.2em]">
                      {player.name.display.primary}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="leading-[1.2em]">
                      {player.statistics?.ronPureScoreAvg?.toFixed(2) ?? '0.00'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-[.5em]">
          <p className="text-center">銃和率</p>
          <div className="flex-1 flex flex-col gap-y-1">
            {lowestChuckPPlayers.map((player) => (
              <div
                key={player.id}
                className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center text-white rounded-lg"
                style={{
                  background: `${player.color.primary}C0`,
                }}
              >
                <div className="flex items-center justify-between px-[.5em] gap-x-[.5em] py-[.25em]">
                  <div className="flex-1">
                    <p className="leading-[1.2em]">
                      {player.name.display.primary}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="leading-[1.2em]">
                      {player.statistics?.chuckP?.toFixed(2) ?? '0.00'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-[.5em]">
          <p className="text-center">最高得點</p>
          <div className="flex-1 flex flex-col gap-y-1">
            {highestScoreMax.map((player) => (
              <div
                key={player.id}
                className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center text-white rounded-lg"
                style={{
                  background: `${player.color.primary}C0`,
                }}
              >
                <div className="flex items-center justify-between px-[.5em] gap-x-[.5em] py-[.25em]">
                  <div className="flex-1">
                    <p className="leading-[1.2em]">
                      {player.name.display.primary}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="leading-[1.2em]">
                      {player.statistics?.scoreMax?.toFixed(0) ?? '0'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
