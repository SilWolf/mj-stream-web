import { useQuery } from '@tanstack/react-query'
import useCurrentTournament from '../../hooks/useCurrentTournament'
import { useState } from 'react'
import { apiQueryMatchesByTournamentId } from '../../services/match.service'
import { V2MatchPlayer } from '../../models/V2Match.model'
import { Link } from 'wouter'
import { renderDate } from '@/utils/string.util'

function PlayerMiniCard({ player }: { player: V2MatchPlayer }) {
  return (
    <div className="flex gap-1 items-center">
      <div
        className="h-10 aspect-square p-1"
        style={{ backgroundColor: player.color.primary }}
      >
        <img
          src={player.image.logo?.default.url}
          className="aspect-square"
          alt=""
        />
      </div>
      <img
        src={player.image.portrait?.default.url}
        className="h-10 aspect-[18/25]"
        alt=""
      />
      <div>
        <p>{player.name.display.third}</p>
        <p className="text-sm leading-4 opacity-50">
          {player.name.display.primary}
        </p>
      </div>
    </div>
  )
}

export default function RecentMatchesSection() {
  const { data } = useCurrentTournament()

  const [selectedCriteria, setSelectedCriteria] = useState<'recent'>('recent')

  const { data: matches = [] } = useQuery({
    queryKey: [
      'v2-tournaments',
      data?.tournament.id,
      'matches',
      selectedCriteria,
    ],
    queryFn: ({ queryKey }) =>
      apiQueryMatchesByTournamentId(queryKey[1]!, { recent: true }),
    enabled: !!data?.tournament.id,
  })

  if (!data) {
    return <></>
  }

  return (
    <>
      <h2 className="text-2xl">近期賽事</h2>
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>對局</th>
            <th>東</th>
            <th>南</th>
            <th>西</th>
            <th>北</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {matches.map((match) => (
            <tr key={match.code}>
              <th>
                <p>{match.data.name.official.primary}</p>
                <p className="font-normal opacity-50">
                  {renderDate(match.data.startAt)}
                </p>
              </th>
              <td>
                <PlayerMiniCard
                  player={
                    data.playersMap[match.data.players[0].id] ??
                    match.data.players[0]
                  }
                />
              </td>
              <td>
                <PlayerMiniCard
                  player={
                    data.playersMap[match.data.players[1].id] ??
                    match.data.players[1]
                  }
                />
              </td>
              <td>
                <PlayerMiniCard
                  player={
                    data.playersMap[match.data.players[2].id] ??
                    match.data.players[2]
                  }
                />
              </td>
              <td>
                <PlayerMiniCard
                  player={
                    data.playersMap[match.data.players[3].id] ??
                    match.data.players[3]
                  }
                />
              </td>
              <td>
                <Link
                  href={`/matches/${match.code}/edit`}
                  className="text-success"
                >
                  導入至直播系統
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
