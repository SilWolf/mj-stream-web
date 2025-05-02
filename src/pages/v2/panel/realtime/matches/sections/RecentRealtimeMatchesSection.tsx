import useRealtimeMatches from '@/hooks/useRealtimeMatches'
import { RealtimePlayer } from '@/models'

function RealtimePlayerMiniCard({ player }: { player: RealtimePlayer }) {
  return (
    <div className="flex gap-1 items-center">
      <div
        className="h-10 aspect-square p-1"
        style={{ backgroundColor: player.color }}
      >
        <img src={player.logoUrl || 'null'} className="aspect-square" alt="" />
      </div>
      <img
        src={player.propicUrl || 'null'}
        className="h-10 aspect-[18/25]"
        alt=""
      />
      <div>
        <p>{player.nickname}</p>
        <p className="text-sm leading-4 opacity-50">{player.primaryName}</p>
      </div>
    </div>
  )
}

export default function RecentRealtimeMatchesSection() {
  const { rtMatches = [] } = useRealtimeMatches()

  return (
    <>
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            <th>對局</th>
            <th className="w-1/5">東</th>
            <th className="w-1/5">南</th>
            <th className="w-1/5">西</th>
            <th className="w-1/5">北</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {rtMatches.map((rtMatch) => (
            <tr key={rtMatch.code}>
              <th>
                <div>{rtMatch.name}</div>
                <div className="flex flex-wrap gap-1">
                  {!rtMatch.flag?.isUploaded && (
                    <div className="badge badge-outline badge-error">
                      未上傳
                    </div>
                  )}
                </div>
              </th>
              <td>
                <RealtimePlayerMiniCard player={rtMatch.players[0]} />
              </td>
              <td>
                <RealtimePlayerMiniCard player={rtMatch.players[1]} />
              </td>
              <td>
                <RealtimePlayerMiniCard player={rtMatch.players[2]} />
              </td>
              <td>
                <RealtimePlayerMiniCard player={rtMatch.players[3]} />
              </td>
              <td>上傳成績</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
