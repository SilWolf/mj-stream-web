import CountdownSpan from '@/components/CountdownSpan'
import { apiGetTournamentById } from '@/pages/v2/services/tournament/service'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParam } from 'react-use'

import SakuraLeagueStickerForTshirtScreen from './screens/SakuraLeagueStickerForTshirtScreen'
import PlayerRankingScreen from './screens/PlayersRankingScreen'
import PlayersStatRankingScreen from './screens/PlayersStatRankingScreen'

import styles from './index.module.css'

type Props = {
  forwardFlag?: number
  refetchFlag?: number
  resetFlag?: number
  auto?: boolean
  minute?: number
  params?: { tournamentId: string }
}

const RealtimeSummaryPage = ({
  forwardFlag,
  refetchFlag,
  resetFlag,
  auto,
  minute,
  params,
}: Props) => {
  const mInSearch = useSearchParam('m') || minute?.toString()
  const autoInSearch = useSearchParam('auto') || auto

  const { data, refetch: refetchTournament } = useQuery({
    queryKey: ['tournament', params?.tournamentId],
    queryFn: () => apiGetTournamentById(params?.tournamentId as string),
    enabled: !!params?.tournamentId,
    staleTime: 5 * 60 * 1000,
  })

  const [screenIndex, setScreenIndex] = useState<number>(0)
  const [isSlideChanging, setIsSlideChanging] = useState<boolean>(false)

  const [prevForwardFlag, setPrevForwardFlag] = useState<number>(
    forwardFlag ?? 0
  )
  const [prevRefetchFlag, setPrevRefetchFlag] = useState<number>(
    refetchFlag ?? 0
  )
  const [prevResetFlag, setPrevResetFlag] = useState<number>(resetFlag ?? 0)

  const screens = useMemo(
    () => [
      <PlayerRankingScreen tournamentId={params?.tournamentId} />,
      <PlayersStatRankingScreen tournamentId={params?.tournamentId} />,
      <SakuraLeagueStickerForTshirtScreen />,
    ],
    [params?.tournamentId]
  )

  const handleSlideForward = useCallback(() => {
    if (isSlideChanging) {
      return
    }

    setScreenIndex((prev) => prev + 0.5)
    setIsSlideChanging(true)

    setTimeout(() => {
      setScreenIndex((prev) => Math.ceil(prev) % screens.length)
      setIsSlideChanging(false)
    }, 1200)
  }, [isSlideChanging, screens])

  useEffect(() => {
    if (autoInSearch) {
      const loop = setInterval(() => {
        handleSlideForward()
      }, 8000)

      return () => clearInterval(loop)
    }
  }, [autoInSearch, handleSlideForward])

  const handleClickScreen = useCallback(() => {
    handleSlideForward()
  }, [handleSlideForward])

  useEffect(() => {
    if (typeof forwardFlag !== 'undefined' && forwardFlag !== prevForwardFlag) {
      handleSlideForward()
      setPrevForwardFlag(forwardFlag)
    }
  }, [forwardFlag, handleSlideForward, prevForwardFlag])

  useEffect(() => {
    if (typeof refetchFlag !== 'undefined' && refetchFlag !== prevRefetchFlag) {
      refetchTournament()
      setPrevRefetchFlag(refetchFlag)
    }
  }, [prevRefetchFlag, prevResetFlag, refetchFlag, refetchTournament])

  useEffect(() => {
    if (typeof resetFlag !== 'undefined' && resetFlag !== prevResetFlag) {
      setScreenIndex(0)
      setPrevResetFlag(resetFlag)
    }
  }, [
    forwardFlag,
    handleSlideForward,
    prevForwardFlag,
    prevResetFlag,
    resetFlag,
  ])

  if (!data) {
    return <></>
  }

  return (
    <div
      className="absolute inset-0 font-kurewa"
      style={{
        background:
          'linear-gradient(to bottom, rgb(255, 217, 227), rgb(255, 192, 203))',
      }}
      onClick={handleClickScreen}
    >
      <div className="absolute inset-0">
        <video
          src="/videos/ptt-bg3.mp4"
          className="absolute inset-0"
          autoPlay
          loop
          muted
        ></video>
      </div>
      <div className="absolute inset-0 tournament-realtime-report text-[#ec276e] text-[36px] flex py-[1em] px-[1em] gap-x-[1em]">
        <div className="twr-title flex flex-col justify-start gap-[1em] items-center relative">
          <div>
            <img
              src={data.tournament.image.logo?.default.url ?? ''}
              alt={data.tournament.name}
              style={{ width: '3.5em', height: '3.5em', marginTop: '0.15em' }}
            />
          </div>
          <div className="flex-1 flex flex-col justify-center mb-[3.5em] relative">
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center ${styles.screenTitle}`}
              data-active={screenIndex >= 0 && screenIndex <= 1}
            >
              <p
                style={{
                  fontSize: '3em',
                  writingMode: 'vertical-rl',
                  textOrientation: 'upright',
                }}
              >
                現時數據
              </p>
            </div>
            <div
              className={`absolute inset-0 flex items-center justify-center ${styles.screenTitle}`}
              data-active={screenIndex === 2}
            >
              <p
                className="whitespace-nowrap self-start font-kurewa mt-[0.5em]"
                style={{
                  fontSize: '2.2em',
                  lineHeight: '1.1em',
                  letterSpacing: '-0.4em',
                  writingMode: 'vertical-rl',
                  textOrientation: 'upright',
                }}
              >
                印花卡活動
              </p>
              <p
                className="whitespace-nowrap self-end font-kurewa mb-[0.25em]"
                style={{
                  fontSize: '2.2em',
                  lineHeight: '1.1em',
                  letterSpacing: '-0.4em',
                  writingMode: 'vertical-rl',
                  textOrientation: 'upright',
                }}
              >
                下週當值女選手
              </p>
            </div>
          </div>
          {/* <p
            style={{
              fontSize: '1.2em',
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
            }}
          >
            <span
              style={{
                writingMode: 'initial',
                textOrientation: 'initial',
              }}
            >
              {periodStartDate}
            </span>
            ~
            <span
              style={{
                writingMode: 'initial',
                textOrientation: 'initial',
              }}
            >
              {periodEndDate}
            </span>
          </p> */}

          {mInSearch && (
            <div className="absolute bottom-0 left-0 right-0 bg-cyan-500 text-center font-numeric text-[1.5em] pt-[.125em]">
              <p className="text-[.56em]">下一場賽事</p>
              <p>
                <CountdownSpan m={parseInt(mInSearch)} />
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 relative">
          {screens.map((screen, index) => (
            <div
              key={index}
              data-active={index === screenIndex}
              className="absolute inset-0"
            >
              {screen}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RealtimeSummaryPage
