import { V2MatchPlayer } from '@/pages/v2/models/V2Match.model'
import { renderPoint, renderRanking } from '@/utils/string.util'

export default function PlayerCardInRanking({
  player,
  ranking,
}: {
  player: V2MatchPlayer
  ranking: number
}) {
  return (
    <div
      className="relative text-right p-4 rounded-[1em]"
      style={{
        background: player.color.primary,
      }}
    >
      <div className="absolute -top-4 left-[4em] bottom-0 overflow-hidden">
        <img
          src={player.image.portrait?.default.url}
          className="aspect-[18/25] w-[8em]"
        />
      </div>
      <div className="w-full h-[5em] flex items-center justify-between text-white">
        <div className="text-left w-[6em] text-[2em]">
          {renderRanking(ranking)}
        </div>
        <div className="flex-1 text-[3em] leading-[1em] text-left">
          {player.name.display.primary}
        </div>
        <div className="text-[3em] leading-[1em]">
          <p>{renderPoint(player.statistics?.point)}</p>
          <p className="text-[0.5em] opacity-90">
            (半莊數: {player.statistics?.matchCount ?? 0})
          </p>
        </div>
      </div>
    </div>
  )
}
