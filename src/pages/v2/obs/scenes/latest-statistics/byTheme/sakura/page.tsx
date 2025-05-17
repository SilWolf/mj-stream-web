import CountdownSpan from '@/components/CountdownSpan'
import { V2MatchPlayer } from '@/pages/v2/models/V2Match.model'
import { apiGetTournamentById } from '@/pages/v2/services/tournament/service'
import { renderRanking } from '@/utils/string.util'
import { useQuery } from '@tanstack/react-query'
import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParam } from 'react-use'
import PlayerLargeCardInRanking from './components/PlayerLargeCardInRanking'
import PlayerCardInRanking from './components/PlayerCardInRanking'

import styles from './index.module.css'
import SakuraLeagueStickerForTshirtScreen from './screens/SakuraLeagueStickerForTshirtScreen'

type Slide =
  | {
      _id: string
      type: 'empty'
      subslide: 0
    }
  | {
      _id: string
      type: 'grand-ranking'
      players: V2MatchPlayer[]
      subslide: 1
    }
  | {
      _id: string
      type: 'players'
      highestPointPlayers: V2MatchPlayer[]
      highestRonPPlayers: V2MatchPlayer[]
      highestRonPureScoreAvgPlayers: V2MatchPlayer[]
      lowestChuckPPlayers: V2MatchPlayer[]
      highestScoreMax: V2MatchPlayer[]
      subslide: 1
    }

const TournamentDetailSlide = ({
  slide,
  status,
  subslide,
}: {
  slide: Slide
  status: number
  subslide: number
}) => {
  if (slide.type === 'grand-ranking') {
    return (
      <div
        className={`absolute inset-0 flex flex-col ${styles['twr-players-ranking']}`}
        data-active={status === 0}
      >
        <div className="flex gap-x-8 items-end">
          <div
            className="twr-players-ranking-item flex-5"
            style={
              {
                '--transition-in-delay': '0s',
                '--transition-out-delay': '0s',
              } as CSSProperties
            }
          >
            <PlayerLargeCardInRanking player={slide.players[1]} ranking={2} />
          </div>
          <div
            className="twr-players-ranking-item flex-6 text-[1.2em]"
            style={
              {
                '--transition-in-delay': '0s',
                '--transition-out-delay': '0s',
              } as CSSProperties
            }
          >
            <PlayerLargeCardInRanking player={slide.players[0]} ranking={1} />
          </div>
          <div
            className="twr-players-ranking-item flex-5"
            style={
              {
                '--transition-in-delay': '0s',
                '--transition-out-delay': '0s',
              } as CSSProperties
            }
          >
            <PlayerLargeCardInRanking player={slide.players[2]} ranking={3} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 text-[0.5em] mt-8">
          <div className="space-y-4">
            {slide.players.slice(3, 10).map((player, index) => (
              <div
                key={player.id}
                className="twr-players-ranking-item"
                style={
                  {
                    '--transition-in-delay': `${((index + 1) * 0.08).toFixed(2)}s`,
                    '--transition-out-delay': `0s`,
                  } as CSSProperties
                }
              >
                <PlayerCardInRanking player={player} ranking={index + 4} />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {slide.players.slice(10, 16).map((player, index) => (
              <div
                key={player.id}
                className="twr-players-ranking-item"
                style={
                  {
                    '--transition-in-delay': `${((index + 4) * 0.08).toFixed(2)}s`,
                    '--transition-out-delay': `0s`,
                  } as CSSProperties
                }
              >
                <PlayerCardInRanking player={player} ranking={index + 11} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  } else if (slide.type === 'players') {
    return (
      <div
        className="absolute inset-0 flex twr-player-ranking gap-[1em] items-stretch twr-player-ranking"
        data-active={status === 0}
        style={{
          opacity: status >= 0 && status < 1 ? 1 : 0,
        }}
      >
        <div className="flex-1 flex flex-col gap-y-[.5em]">
          <h4 className="text-[2em] font-semibold text-center leading-[1em] twr-player-ranking-row">
            MVP
          </h4>
          <p className="text-center twr-player-ranking-row">積分最高選手</p>
          <div className="flex-1 flex flex-col">
            {slide.highestPointPlayers.map((player, index) => (
              <div
                key={player.id}
                className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center twr-player-ranking-row"
                style={{
                  background: `linear-gradient(to right, ${player.color.primary}C0, transparent 105%)`,
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                <img
                  src={player.image.portrait?.default.url}
                  alt={player.name.display.primary}
                  className="absolute left-[3em] opacity-25 -z-10"
                />
                <div className="flex items-center justify-between px-[.5em] gap-x-[.5em]">
                  <div className="w-[2.2em]">{renderRanking(index + 1)}</div>
                  <div className="flex-1">
                    <p className="text-[1.5em] leading-[1em]">
                      {player.name.display.primary}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[1.5em] leading-[1em] font-numeric">
                      {player.statistics?.point?.toFixed(1) ?? '0.0'}
                    </p>
                    <p className="text-[.75em] leading-[1em] opacity-80">
                      (半莊數: {player.statistics?.matchCount ?? 0})
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1em] twr-player-ranking-row">
          <div className="space-y-[.5em]">
            <p className="text-center">和了率</p>
            <div className="flex-1 flex flex-col">
              {slide.highestRonPPlayers.map((player) => (
                <div
                  key={player.id}
                  className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center"
                  style={{
                    background: `${player.color.primary}20`,
                  }}
                >
                  <img
                    src={player.image.portrait?.default.url}
                    alt={player.name.display.primary}
                    className="absolute left-[3em] opacity-5 -z-10"
                  />
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
            <div className="flex-1 flex flex-col">
              {slide.highestRonPureScoreAvgPlayers.map((player) => (
                <div
                  key={player.id}
                  className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center"
                  style={{
                    background: `${player.color.primary}20`,
                  }}
                >
                  <img
                    src={player.image.portrait?.default.url}
                    alt={player.name.display.primary}
                    className="absolute left-[3em] opacity-5 -z-10"
                  />
                  <div className="flex items-center justify-between px-[.5em] gap-x-[.5em] py-[.25em]">
                    <div className="flex-1">
                      <p className="leading-[1.2em]">
                        {player.name.display.primary}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="leading-[1.2em]">
                        {player.statistics?.ronPureScoreAvg?.toFixed(2) ??
                          '0.00'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-[.5em]">
            <p className="text-center">銃和率</p>
            <div className="flex-1 flex flex-col">
              {slide.lowestChuckPPlayers.map((player) => (
                <div
                  key={player.id}
                  className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center"
                  style={{
                    background: `${player.color.primary}20`,
                  }}
                >
                  <img
                    src={player.image.portrait?.default.url}
                    alt={player.name.display.primary}
                    className="absolute left-[3em] opacity-5 -z-10"
                  />
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
            <div className="flex-1 flex flex-col">
              {slide.highestScoreMax.map((player) => (
                <div
                  key={player.id}
                  className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center"
                  style={{
                    background: `${player.color.primary}20`,
                  }}
                >
                  <img
                    src={player.image.portrait?.default.url}
                    alt={player.name.display.primary}
                    className="absolute left-[3em] opacity-5 -z-10"
                  />
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

  return <></>
}

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

  const [slideIndex, setSlideIndex] = useState<number>(0)
  const [subSlideIndex, setSubSlideIndex] = useState<number>(0)
  const [isSlideChanging, setIsSlideChanging] = useState<boolean>(false)

  const [prevForwardFlag, setPrevForwardFlag] = useState<number>(
    forwardFlag ?? 0
  )
  const [prevRefetchFlag, setPrevRefetchFlag] = useState<number>(
    refetchFlag ?? 0
  )
  const [prevResetFlag, setPrevResetFlag] = useState<number>(resetFlag ?? 0)

  const slides = useMemo<Slide[]>(() => {
    if (!data) {
      return [{ type: 'empty', _id: 'empty', subslide: 0 }]
    }

    const result: Slide[] = [
      {
        type: 'grand-ranking',
        _id: 'grand-ranking',
        players: data.players.toSorted(
          (a, b) => (b.statistics?.point ?? 0) - (a.statistics?.point ?? 0)
        ),
        subslide: 1,
      },
      // {
      //   type: 'players',
      //   _id: 'players',
      //   highestPointPlayers: data.players
      //     .toSorted(
      //       (a, b) => (b.statistics?.point ?? 0) - (a.statistics?.point ?? 0)
      //     )
      //     .slice(0, 6),
      //   highestRonPPlayers: data.players
      //     .toSorted(
      //       (a, b) => (b.statistics?.ronP ?? 0) - (a.statistics?.ronP ?? 0)
      //     )
      //     .slice(0, 6),
      //   highestRonPureScoreAvgPlayers: data.players
      //     .toSorted(
      //       (a, b) =>
      //         (b.statistics?.ronPureScoreAvg ?? 0) -
      //         (a.statistics?.ronPureScoreAvg ?? 0)
      //     )
      //     .slice(0, 6),
      //   lowestChuckPPlayers: data.players
      //     .toSorted(
      //       (a, b) => (a.statistics?.chuckP ?? 0) - (b.statistics?.chuckP ?? 0)
      //     )
      //     .slice(0, 6),
      //   highestScoreMax: data.players
      //     .toSorted(
      //       (a, b) =>
      //         (b.statistics?.scoreMax ?? 0) - (a.statistics?.scoreMax ?? 0)
      //     )
      //     .slice(0, 6),
      //   subslide: 1,
      // },
    ]

    if (!autoInSearch) {
      result.unshift({ type: 'empty', _id: 'empty', subslide: 0 })
    }

    return result
  }, [autoInSearch, data])

  const handleSlideForward = useCallback(() => {
    if (isSlideChanging) {
      return
    }

    const activeSlide = slides[slideIndex]
    if (!activeSlide) {
      setSlideIndex(1)
      return
    }

    if (activeSlide.type === 'empty') {
      setSlideIndex((prev) => prev + 1)
    } else if (subSlideIndex >= activeSlide.subslide - 1) {
      setSlideIndex((prev) => prev + 0.5)
      setIsSlideChanging(true)

      setTimeout(() => {
        setSlideIndex((prev) => Math.ceil(prev) % slides.length)
        setSubSlideIndex(0)
        setIsSlideChanging(false)
      }, 1200)
    } else {
      setSubSlideIndex((prev) => prev + 0.5)
      setIsSlideChanging(true)

      setTimeout(() => {
        setSubSlideIndex((prev) => Math.ceil(prev) % slides.length)
        setIsSlideChanging(false)
      }, 1200)
    }
  }, [isSlideChanging, slideIndex, slides, subSlideIndex])

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
      setSlideIndex(0)
      setSubSlideIndex(0)
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
      className="absolute inset-0"
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
          <div className="flex-1 flex flex-col justify-center pb-[3.5em]">
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
          {slides.map((slide, index) => (
            <TournamentDetailSlide
              key={slide._id}
              slide={slide}
              status={slideIndex - index}
              subslide={subSlideIndex}
            />
          ))}

          <SakuraLeagueStickerForTshirtScreen active={true} />
        </div>
      </div>
    </div>
  )
}

export default RealtimeSummaryPage
