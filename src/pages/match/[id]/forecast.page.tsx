import useDbMatch from '@/hooks/useDbMatch'
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

  if (sec <= 0) {
    return <span className="text-[.5em]">比賽即將開始</span>
  }

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
  const { data: match } = useDbMatch(matchId)

  const teams = useMemo(() => {
    if (!match) {
      return []
    }

    return [
      match.playerEastTeam,
      match.playerSouthTeam,
      match.playerWestTeam,
      match.playerNorthTeam,
    ]
  }, [match])

  const startAt = useSearchParam('startAt')
  const m = useSearchParam('m')
  const initialMinutes = useMemo(() => {
    if (m) {
      return parseInt(m)
    }
    try {
      const [hour, minute] = startAt!.split(':').map((value) => parseInt(value))
      const targetDate = new Date()
      targetDate.setHours(hour)
      targetDate.setMinutes(minute)

      const now = new Date()

      return Math.max(0, (targetDate.getTime() - now.getTime()) / 60000)
    } catch {
      return 15
    }
  }, [m, startAt])

  return (
    <div
      className="absolute inset-0 text-white flex flex-col justify-center items-center"
      style={{
        background:
          'linear-gradient(to bottom, rgb(30, 34, 59), rgb(16, 18, 33))',
      }}
    >
      <div className="w-[80vw]">
        <div className="flex justify-between">
          <img
            src="/mj-stream-web/images/tournament-long-logo.png"
            className="w-[50%]"
            alt=""
          />
          <div>
            <img
              src="/mj-stream-web/images/logo-hkma.webp"
              className="w-[12vw]"
              alt=""
            />
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
            {teams.map((team) => (
              <img
                className="w-[16vw] aspect-square"
                src={team?.squareLogoImage + '?w=500&h=500'}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-[5vh] left-[10vw]">
        <div>
          <img
            src="/mj-stream-web/images/homepage-qr.png"
            className="w-[8vw]"
            alt=""
          />
        </div>
        <p className="text-[32px]">
          聯賽官網: <u>https://hkleague2025.hkmahjong.org/</u>
        </p>
      </div>
    </div>
  )
}

export default MatchForecastPage
