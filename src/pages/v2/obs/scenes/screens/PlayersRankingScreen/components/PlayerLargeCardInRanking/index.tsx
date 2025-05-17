import { V2MatchPlayer } from '@/pages/v2/models/V2Match.model'
import { renderPoint, renderRanking } from '@/utils/string.util'

export default function PlayerLargeCardInRanking({
  player,
  ranking,
}: {
  player: V2MatchPlayer
  ranking: number
}) {
  return (
    <div
      className="relative text-right p-4 rounded-[1em] mt-[3em] text-white flex justify-between items-center"
      style={{
        background: player.color.primary,
      }}
    >
      <div className="absolute left-[2.8em] bottom-0">
        <img
          src={player.image.portrait?.default.url}
          className="aspect-[18/25] w-[5em]"
        />
      </div>
      <div className="leading-[1em] text-[1.2em]">{renderRanking(ranking)}</div>
      <div>
        <div className="leading-[1em]">{player.name.display.primary}</div>
        <div className="text-[1.6em] leading-[1em]">
          {renderPoint(player.statistics?.point)}
        </div>
      </div>
    </div>
  )
}
