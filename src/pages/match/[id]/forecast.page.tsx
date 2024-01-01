import useMatch from '@/hooks/useMatch'
import { PlayerIndex } from '@/models'
import { useEffect, useMemo, useState } from 'react'
import { useInterval, useSearchParam } from 'react-use'

const CountdownTimer = ({ initialMinutes }: { initialMinutes: number }) => {
  const [sec, setSec] = useState<number>(0)
  const [minutes, seconds] = useMemo(
    () => [
      Math.floor(sec / 60)
        .toString()
        .padStart(2, '0'),
      (sec % 60).toString().padStart(2, '0'),
    ],
    [sec]
  )

  useEffect(() => {
    setSec(initialMinutes * 60)
  }, [initialMinutes])

  useInterval(
    () => {
      setSec((prev) => prev - 1)
    },
    sec > 0 ? 1000 : null
  )

  return (
    <span>
      {minutes}:{seconds}
    </span>
  )
}

type Props = {
  params: { matchId: string }
}

const MatchForecastPage = ({ params: { matchId } }: Props) => {
  const { match } = useMatch(matchId)

  const players = useMemo(() => {
    if (!match) {
      return []
    }

    return (['0', '1', '2', '3'] as PlayerIndex[]).map(
      (index) => match.players[index]
    )
  }, [match])

  const minutes = useSearchParam('m')
  const initialMinutes = useMemo(() => {
    const n = parseInt(minutes as string)
    if (isNaN(n)) {
      return 15
    }

    return n
  }, [minutes])

  return (
    <div
      className="fixed inset-0 text-white flex flex-col justify-center items-center"
      style={{
        background:
          'linear-gradient(to bottom, rgb(30, 34, 59), rgb(16, 18, 33))',
      }}
    >
      <div className="w-[80vw]">
        <div className="flex justify-between">
          <img
            src="/images/tournament-long-logo.png"
            className="w-[50%]"
            alt=""
          />
          <div>
            <img src="/images/logo-hkma.webp" className="w-[12vw]" alt="" />
          </div>
        </div>
        <div className="flex justify-between items-center mb-[10vh]">
          <div
            style={{
              paddingBottom: '25vh',
            }}
          >
            <p className="text-left text-[80px] leading-3">下一場賽事</p>
            <p className="text-left text-[120px] scale-[200%] origin-top-left font-numeric">
              <CountdownTimer initialMinutes={initialMinutes} />
            </p>
          </div>
          <div className="grid grid-cols-2 gap-[2vw]">
            {players.map((player) => (
              <img
                className="w-[16vw] aspect-square"
                src={player.largeTeamPicUrl as string}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-[5vh] left-[10vw]">
        <div>
          <img src="/images/homepage-qr.png" className="w-[8vw]" alt="" />
        </div>
        <p className="text-[32px]">
          聯賽官網: <u>https://hkleague2024.hkmahjong.org/</u>
        </p>
      </div>
    </div>
  )
}

export default MatchForecastPage
