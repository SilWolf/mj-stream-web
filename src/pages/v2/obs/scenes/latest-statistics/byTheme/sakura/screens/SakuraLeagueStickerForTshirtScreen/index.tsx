import { V2MatchPlayer } from '@/pages/v2/models/V2Match.model'
import useActivityBySlug from '@/pages/v2/services/activity/hooks/useActivityBySlug'
import useTournamentById from '@/pages/v2/services/tournament/hooks/useTournamentById'
import {
  getArrayOfComingNDates,
  renderDateAsShortForm,
  renderDayOfDate,
} from '@/utils/date.util'
import { useMemo } from 'react'

function PlayerMiniCard({ player }: { player: V2MatchPlayer }) {
  return (
    <div className="text-center">
      <img
        src={player.image.portrait?.default.url}
        className="w-[72%] ml-[18%]"
        style={{
          maskImage:
            'linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0.05))',
        }}
      />
      <h3
        className="leading-[1em] text-[0.8em]"
        style={{
          color: player.color.primary,
        }}
      >
        {player.name.display.primary}
      </h3>
    </div>
  )
}

export default function SakuraLeagueStickerForTshirtScreen({
  active,
}: {
  active?: boolean
}) {
  const { data: activity } = useActivityBySlug(
    'sakura-league-sticker-for-tshirt'
  )
  const { data } = useTournamentById(activity?.tournament?._ref)

  const playersGroupedByDate = useMemo(() => {
    if (!activity || !data?.playersMap) {
      return null
    }

    const days = getArrayOfComingNDates(7)
    const result: { date: string; players: V2MatchPlayer[] }[] = []

    for (const date of days) {
      result.push({
        date,
        players:
          activity.attendees
            ?.filter(
              ({ attendOn, player: { _ref } }) =>
                attendOn.startsWith(date) && data.playersMap[_ref]
            )
            .map(({ player: { _ref } }) => data.playersMap[_ref]) ?? [],
      })
    }

    return result
  }, [activity, data?.playersMap])

  if (!activity || !data || !playersGroupedByDate) {
    return <></>
  }

  return (
    <div
      className="w-full h-full grid grid-cols-2 grid-rows-4 grid-flow-col gap-[0.5em]"
      data-active={active}
    >
      {playersGroupedByDate.map(({ date, players }) => (
        <div
          key={date}
          className="bg-white/50 rounded-[0.5em] flex items-center"
        >
          <div className="w-[4em] text-[1.25em] text-center">
            <p>{renderDateAsShortForm(date)}</p>
            <p>({renderDayOfDate(date)})</p>
          </div>
          <div className="flex-1 grid grid-cols-3">
            {players.map((player) => (
              <div className="w-[5.5em]">
                <PlayerMiniCard key={player.id} player={player} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div>
        <p className="w-full h-full text-center place-content-center text-[1.8em]">
          集齊 5 張蓋滿的印花卡
          <br />
          即可換領女雀士應援 T 恤
        </p>
      </div>
    </div>
  )
}
