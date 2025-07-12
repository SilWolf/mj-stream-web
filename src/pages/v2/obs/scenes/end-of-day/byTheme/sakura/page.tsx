import { V2MatchPlayer } from '@/pages/v2/models/V2Match.model'
import useActivityBySlug from '@/pages/v2/services/activity/hooks/useActivityBySlug'
import useTournamentById from '@/pages/v2/services/tournament/hooks/useTournamentById'
import {
  getArrayOfComingNDates,
  renderDateAsShortForm,
  renderDayOfDate,
} from '@/utils/date.util'
import { getQrCodeImgSrc } from '@/utils/string.util'
import { useMemo } from 'react'

function PlayerMiniCard({ player }: { player: V2MatchPlayer }) {
  return (
    <div className="text-center">
      <img
        src={player.image.portrait?.default.url}
        className="w-full"
        style={{
          maskImage:
            'linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0.05))',
        }}
      />
      <h3
        className="leading-[1em] text-[0.8em] font-kurewa"
        style={{
          color: player.color.primary,
        }}
      >
        {player.name.display.primary}
      </h3>
    </div>
  )
}

export default function ObsRoomEndPage() {
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

  return (
    <div
      className="absolute inset-0 text-[#ec276e] flex flex-col justify-center items-center"
      style={{
        background:
          'linear-gradient(to bottom, rgb(255, 217, 227), rgb(255, 192, 203))',
      }}
    >
      <div className="absolute inset-0">
        <video
          src="/mj-stream-web/videos/ptt-bg3.mp4"
          className="absolute inset-0"
          autoPlay
          loop
          muted
        ></video>
      </div>

      <div className="relative z-10 w-full h-full pl-[2em] py-[3em] pr-[4em] grid grid-cols-3 gap-x-[2em] font-kurewa">
        <div className="relative flex flex-col justify-between border-r border-[#ec276e80]">
          <div className="mx-auto w-[80%]">
            <img
              src="/mj-stream-web/images/logo-sakura-long.png"
              className="w-full"
              alt=""
            />

            <div className="flex items-center justify-center gap-x-[2em]">
              <div className="flex-1">
                <img
                  className="w-full"
                  src="/mj-stream-web/images/logo-poly.webp"
                  alt=""
                />
              </div>
              <div className="flex-1">
                <img
                  className="w-full"
                  src="/mj-stream-web/images/logo-hkma-black.png"
                  alt=""
                />
              </div>
            </div>
          </div>

          <p className="text-[80px] pb-[60px] text-center">
            本次賽事結束
            <br />
            感謝耐心收看
          </p>

          <div className="flex">
            <div className="flex-1">
              <div className="text-center">
                <img
                  src={getQrCodeImgSrc('https://sakura2025.hkmahjong.org/')}
                  className="w-[200px] aspect-square mx-auto"
                  alt=""
                />
                {/* <p className="text-[32px] text-center">
              <u>https://sakura2025.hkmahjong.org/</u>
            </p> */}
                <p className="text-[32px] text-center">官網</p>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-center">
                <img
                  src={getQrCodeImgSrc(
                    'https://www.instagram.com/hk_sakura_league/'
                  )}
                  className="w-[200px] aspect-square mx-auto"
                  alt=""
                />
                {/* <p className="text-[32px] text-center">
              <u>https://www.instagram.com/hk_sakura_league/</u>
            </p> */}
                <p className="text-[32px] text-center">Instagram</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 text-[2em]">
          <div className="text-[1.5em] font-bold font-kurewa mb-4">
            印花卡活動 下週當值女選手
          </div>
          <div className="grid grid-cols-2 grid-rows-4 grid-flow-col gap-[0.5em]">
            {playersGroupedByDate?.map(({ date, players }) => (
              <div
                key={date}
                className={`bg-white/50 rounded-[0.5em] flex items-center py-[0.2em]`}
              >
                <div className="w-[4em] text-[1.25em] text-center font-kurewa">
                  <p>{renderDateAsShortForm(date)}</p>
                  <p>({renderDayOfDate(date)})</p>
                </div>
                <div className="flex-1 grid grid-cols-3">
                  {players.map((player) => (
                    <div className="w-[4em]">
                      <PlayerMiniCard key={player.id} player={player} />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <p
                className={`w-full h-full text-center place-content-center text-[1.5em]`}
              >
                集齊 5 張蓋滿的印花卡
                <br />
                即可換領女雀士應援 T 恤
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
