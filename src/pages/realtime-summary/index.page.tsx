import CountdownSpan from '@/components/CountdownSpan'
import MJTeamHistoryChart from '@/components/MJTeamHistoryChart'
import { apiGetTournament } from '@/helpers/sanity.helper'
import { Player, PlayerStatistic, Team } from '@/models'
import { renderPoint, renderRanking } from '@/utils/string.util'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParam } from 'react-use'

type Slide =
  | {
      _id: string
      type: 'empty'
      subslide: 0
    }
  | {
      _id: string
      type: 'teams'
      teams: Awaited<ReturnType<typeof apiGetTournament>>['teams']
      subslide: 1 | 2
    }
  | {
      _id: string
      type: 'chart'
      teams: Awaited<ReturnType<typeof apiGetTournament>>['teams']
      subslide: 1 | 2
    }
  | {
      _id: string
      type: 'players'
      highestPointPlayers: {
        teamAndPlayer: { team: Team; player: Player }
        value: number
        tieBreakValue: number
      }[]
      highestRonPPlayers: {
        teamAndPlayer: { team: Team; player: Player }
        value: number
        tieBreakValue: number
      }[]
      highestRonPurePointPlayers: {
        teamAndPlayer: { team: Team; player: Player }
        value: number
        tieBreakValue: number
      }[]
      lowestChuckPPlayers: {
        teamAndPlayer: { team: Team; player: Player }
        value: number
        tieBreakValue: number
      }[]
      highestScoreMax: {
        teamAndPlayer: { team: Team; player: Player }
        value: number
        tieBreakValue: number
      }[]
      subslide: 1 | 2
    }
  | {
      _id: string
      type: 'heatmap'
      teams: Awaited<ReturnType<typeof apiGetTournament>>['teams']
      highestTeamPoint: number
      lowestTeamPoint: number
      highestPlayerPoint: number
      lowestPlayerPoint: number
      subslide: 1 | 2
    }

const TOURNAMENT_ID = '62e7d07d-f59f-421d-a000-2e4d28ab89db'

const sortPlayersAndConvertToTeamPlayerDTOByKey = (
  teamAndPlayers: { team: Team; player: Player }[],
  valueFn: (stat: PlayerStatistic) => number,
  tieBreakValueFn: (stat: PlayerStatistic) => number,
  direction: 'asc' | 'desc',
  tieBreakDirection: 'asc' | 'desc'
): {
  teamAndPlayer: { team: Team; player: Player }
  value: number
  tieBreakValue: number
}[] => {
  return teamAndPlayers
    .map((teamAndPlayer) => ({
      teamAndPlayer,
      value: valueFn(teamAndPlayer.player.statistics!),
      tieBreakValue: tieBreakValueFn(teamAndPlayer.player.statistics!),
    }))
    .sort((a, b) => {
      if (a.value === b.value) {
        return (
          (a.tieBreakValue - b.tieBreakValue) *
          (tieBreakDirection === 'asc' ? 1 : -1)
        )
      }
      return (a.value - b.value) * (direction === 'asc' ? 1 : -1)
    })
    .slice(0, 6)
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
  if (slide.type === 'teams') {
    return (
      <div
        className="absolute inset-0 flex flex-col twr-team-ranking"
        data-active={status === 0}
        style={{
          opacity: status >= 0 && status < 1 ? 1 : 0,
        }}
      >
        <div className="grid grid-flow-col grid-rows-1 gap-x-8 twr-team-ranking-row">
          <div className="flex-1 flex items-center text-[0.75em]">
            <p className="flex-1 text-center">排名</p>
            <p className="flex-[2.5]">隊伍</p>
            <p className="flex-1 text-right">積分</p>
            <p className="flex-1 text-right">差距</p>
            <p className="flex-1 text-right">半莊數</p>
          </div>
          <div className="flex-1 flex items-center text-[0.75em]">
            <p className="flex-1 text-center">排名</p>
            <p className="flex-[2.5]">隊伍</p>
            <p className="flex-1 text-right">積分</p>
            <p className="flex-1 text-right">差距</p>
            <p className="flex-1 text-right">半莊數</p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-x-8 h-full">
          {[0, 8, 1, 9, 2, 10, 3, 11, 4, 12, 5, 13, 6, 14, 7, 15].map(
            (ranking) => (
              <div
                key={ranking}
                className="relative flex-1 flex items-center overflow-hidden twr-team-ranking-row"
                style={{
                  background: `linear-gradient(to right, ${slide.teams[ranking].team.color}C0, transparent 105%)`,
                  animationDelay: `${ranking * 0.05}s`,
                }}
              >
                <img
                  src={
                    slide.teams[ranking].team.squareLogoImage + '?w=320&h=320'
                  }
                  alt={slide.teams[ranking].team._id}
                  className="absolute left-48 opacity-10 -z-10"
                />
                <p className="flex-1 text-center space-x-2">
                  <span>
                    {renderRanking(slide.teams[ranking].statistics.ranking)}
                  </span>
                  {/* <TeamRankingUpOrDownSpan
                value={
                  (team.rankingHistories.at(-1) ?? 0) -
                  (team.rankingHistories.at(-3) ?? 0)
                }
              /> */}
                </p>
                <div className="flex-[2.5]">
                  <p>{slide.teams[ranking].team.name}</p>
                  <p className="text-[24px] leading-[24px]">
                    {slide.teams[ranking].team.secondaryName}
                  </p>
                </div>
                <p className="flex-1 text-right">
                  {renderPoint(slide.teams[ranking].statistics.point)}
                </p>
                <p className="flex-1 text-right">
                  {ranking > 0
                    ? (
                        slide.teams[ranking - 1].statistics.point -
                        slide.teams[ranking].statistics.point
                      ).toFixed(1)
                    : '-'}
                </p>
                <p className="flex-1 text-right">
                  {slide.teams[ranking].statistics.matchCount}
                  <span className="text-[0.75em]">/60</span>
                </p>
              </div>
            )
          )}
        </div>
      </div>
    )
  } else if (slide.type === 'chart') {
    return (
      <div
        className="absolute inset-0 flex twr-chart gap-[1em] items-stretch"
        data-active={status === 0}
        style={{
          opacity: status >= 0 && status < 1 ? 1 : 0,
        }}
      >
        <div className="flex-[3] twr-chart-chart">
          <MJTeamHistoryChart teamAndStatistics={slide.teams} />
        </div>
        <div
          className="flex-1 flex flex-col twr-team-ranking"
          data-active={status === 0}
        >
          {slide.teams.map((team, index) => (
            <div
              key={team.team._id}
              className="relative flex-1 flex items-center justify-between overflow-hidden twr-team-ranking-row px-2"
              style={{
                background: `linear-gradient(to right, ${team.team.color}C0, transparent 105%)`,
                animationDelay: `${index * 0.05}s`,
              }}
            >
              <img
                src={team.team.squareLogoImage + '?w=320&h=320'}
                alt={team.team._id}
                className="absolute left-0 opacity-5 -z-10"
              />
              <div>
                <p>{team.team.name}</p>
                {/* <p className="text-sm">{team.team.secondaryName}</p> */}
              </div>
              <div>{renderPoint(team.statistics.point)}</div>
            </div>
          ))}
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
            {slide.highestPointPlayers.map(
              (
                { teamAndPlayer: { team, player }, value, tieBreakValue },
                index
              ) => (
                <div
                  key={player._id}
                  className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center twr-player-ranking-row"
                  style={{
                    background: `linear-gradient(to right, ${team.color}C0, transparent 105%)`,
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <img
                    src={team.squareLogoImage + '?w=320&h=320'}
                    alt={team.name!}
                    className="absolute left-[3em] opacity-25 -z-10"
                  />
                  <div className="flex items-center justify-between px-[.5em] gap-x-[.5em]">
                    <div className="w-[2.2em]">{renderRanking(index + 1)}</div>
                    <div className="flex-1">
                      <p className="text-[1.5em] leading-[1em]">
                        {player.nickname}
                      </p>
                      <p className="text-[.75em] leading-[1em]">
                        {player.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[1.5em] leading-[1em] font-numeric">
                        {value.toFixed(1)}
                      </p>
                      <p className="text-[.75em] leading-[1em] opacity-80">
                        (半莊數: {tieBreakValue})
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1em] twr-player-ranking-row">
          <div className="space-y-[.5em]">
            <p className="text-center">和了率</p>
            <div className="flex-1 flex flex-col">
              {slide.highestRonPPlayers.map(
                ({ teamAndPlayer: { team, player }, value }) => (
                  <div
                    key={player._id}
                    className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center"
                    style={{
                      background: `${team.color}20`,
                    }}
                  >
                    <img
                      src={team.squareLogoImage + '?w=320&h=320'}
                      alt={team.name!}
                      className="absolute left-[3em] opacity-5 -z-10"
                    />
                    <div className="flex items-center justify-between px-[.5em] gap-x-[.5em] py-[.25em]">
                      <div className="flex-1">
                        <p className="leading-[1.2em]">{player.nickname}</p>
                      </div>
                      <div className="text-right">
                        <p className="leading-[1.2em]">{value.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="space-y-[.5em]">
            <p className="text-center">平均打點</p>
            <div className="flex-1 flex flex-col">
              {slide.highestRonPurePointPlayers.map(
                ({ teamAndPlayer: { team, player }, value }) => (
                  <div
                    key={player._id}
                    className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center"
                    style={{
                      background: `${team.color}20`,
                    }}
                  >
                    <img
                      src={team.squareLogoImage + '?w=320&h=320'}
                      alt={team.name!}
                      className="absolute left-[3em] opacity-5 -z-10"
                    />
                    <div className="flex items-center justify-between px-[.5em] gap-x-[.5em] py-[.25em]">
                      <div className="flex-1">
                        <p className="leading-[1.2em]">{player.nickname}</p>
                      </div>
                      <div className="text-right">
                        <p className="leading-[1.2em]">{value.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="space-y-[.5em]">
            <p className="text-center">銃和率</p>
            <div className="flex-1 flex flex-col">
              {slide.lowestChuckPPlayers.map(
                ({ teamAndPlayer: { team, player }, value }) => (
                  <div
                    key={player._id}
                    className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center"
                    style={{
                      background: `${team.color}20`,
                    }}
                  >
                    <img
                      src={team.squareLogoImage + '?w=320&h=320'}
                      alt={team.name!}
                      className="absolute left-[3em] opacity-5 -z-10"
                    />
                    <div className="flex items-center justify-between px-[.5em] gap-x-[.5em] py-[.25em]">
                      <div className="flex-1">
                        <p className="leading-[1.2em]">{player.nickname}</p>
                      </div>
                      <div className="text-right">
                        <p className="leading-[1.2em]">{value.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="space-y-[.5em]">
            <p className="text-center">最高得點</p>
            <div className="flex-1 flex flex-col">
              {slide.highestScoreMax.map(
                ({ teamAndPlayer: { team, player }, value }) => (
                  <div
                    key={player._id}
                    className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center"
                    style={{
                      background: `${team.color}20`,
                    }}
                  >
                    <img
                      src={team.squareLogoImage + '?w=320&h=320'}
                      alt={team.name!}
                      className="absolute left-[3em] opacity-5 -z-10"
                    />
                    <div className="flex items-center justify-between px-[.5em] gap-x-[.5em] py-[.25em]">
                      <div className="flex-1">
                        <p className="leading-[1.2em]">{player.nickname}</p>
                      </div>
                      <div className="text-right">
                        <p className="leading-[1.2em]">{value.toFixed(0)}</p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // else if (slide.type === 'heatmap') {
  //   return (
  //     <div
  //       className="absolute inset-0 flex gap-[1em] items-stretch twr-heatmap"
  //       data-active={status === 0}
  //       style={{
  //         opacity: status >= 0 && status < 1 ? 1 : 0,
  //       }}
  //     >
  //       <div className="flex-1 flex flex-col gap-y-[.5em]">
  //         <h4 className="text-[2em] font-semibold text-center leading-[1em] twr-heatmap-title">
  //           點數熱力圖
  //         </h4>
  //         <p className="text-center mb-8 twr-heatmap-title">
  //           <span className="bg-green-500 px-1">綠色</span>
  //           代表高分、
  //           <span className="bg-red-500 px-1">紅色</span>代表低分
  //         </p>
  //         <div className="grid grid-cols-4 flex-1 text-center text-[.8em]">
  //           {slide.teams.map(({ team, players, statistics }, teamIndex) => (
  //             <div
  //               className="h-20 twr-heatmap-cell"
  //               key={team._id}
  //               style={{
  //                 animationDelay: teamIndex * 0.05 + 's',
  //               }}
  //             >
  //               <div
  //                 style={{
  //                   background: `${team.color}80`,
  //                 }}
  //               >
  //                 <img
  //                   src={team.squareLogoImage + '?w=128&h=128'}
  //                   alt={team.name!}
  //                   className="h-24 w-24 my-2 inline-block"
  //                 />
  //               </div>
  //               <p
  //                 className="py-2"
  //                 style={{
  //                   background:
  //                     statistics!.point > 0
  //                       ? `rgba(23, 235, 0, ${
  //                           statistics!.point / slide.highestTeamPoint
  //                         })`
  //                       : `rgba(235, 0, 0, ${
  //                           statistics!.point / slide.lowestTeamPoint
  //                         })`,
  //                 }}
  //               >
  //                 {renderPoint(statistics!.point)}
  //               </p>
  //             </div>
  //           ))}
  //           {([0, 1, 2, 3] as const).map((index) =>
  //             slide.teams.map(({ team }, teamIndex) => (
  //               <div
  //                 className="flex items-center justify-center twr-heatmap-cell"
  //                 key={team._id}
  //                 style={{
  //                   background:
  //                     typeof slide.teamPlayersGroupedByTeamIds[team._id][index]
  //                       .player.statisticss?.point !== 'undefined'
  //                       ? slide.teamPlayersGroupedByTeamIds[team._id][index]
  //                           .player.statisticss!.point > 0
  //                         ? `rgba(23, 235, 0, ${
  //                             slide.teamPlayersGroupedByTeamIds[team._id][index]
  //                               .player.statisticss!.point /
  //                             slide.highestPlayerPoint
  //                           })`
  //                         : `rgba(235, 0, 0, ${
  //                             slide.teamPlayersGroupedByTeamIds[team._id][index]
  //                               .player.statisticss!.point /
  //                             slide.lowestPlayerPoint
  //                           })`
  //                       : 'tranparent',
  //                   animationDelay: (teamIndex + index + 1) * 0.05 + 's',
  //                 }}
  //               >
  //                 {renderPoint(
  //                   slide.teamPlayersGroupedByTeamIds[team._id][index].player
  //                     .statistics?.point
  //                 )}
  //               </div>
  //             ))
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  return <></>
}

type Props = {
  forwardFlag?: number
  refetchFlag?: number
  resetFlag?: number
  disableClick?: boolean
  auto?: boolean
  minute?: number
  params?: unknown
}

const RealtimeSummaryPage = ({
  forwardFlag,
  refetchFlag,
  resetFlag,
  disableClick,
  auto,
  minute,
}: Props) => {
  const mInSearch = useSearchParam('m') || minute?.toString()
  const autoInSearch = useSearchParam('auto') || auto

  const { data: tournament, refetch: refetchTournament } = useQuery({
    queryKey: ['tournament', TOURNAMENT_ID],
    queryFn: () =>
      apiGetTournament(TOURNAMENT_ID as string).then((tournament) => ({
        ...tournament,
        teams: tournament.teams.sort(
          (a, b) => b.statistics.point - a.statistics.point
        ),
      })),
    enabled: !!TOURNAMENT_ID,
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
    if (!tournament) {
      return [{ type: 'empty', _id: 'empty', subslide: 0 }]
    }

    const teamAndPlayers: { team: Team; player: Player }[] = tournament.teams
      .map((team) =>
        team.players.map((player) => ({ team: team.team, player })).flat()
      )
      .flat()

    const filteredTeamAndPlayers = teamAndPlayers.filter(
      ({ player }) => player.statistics!.matchCount > 0
    )

    const playersSortedByPoint = filteredTeamAndPlayers.sort(
      (a, b) =>
        (b.player.statistics?.point ?? 0) - (a.player.statistics?.point ?? 0)
    )

    const result: Slide[] = [
      {
        type: 'teams',
        _id: 'teams',
        teams: tournament.teams,
        subslide: 1,
      },
      {
        type: 'chart',
        _id: 'chart',
        teams: tournament.teams,
        subslide: 1,
      },
      {
        type: 'players',
        _id: 'players',
        highestPointPlayers: sortPlayersAndConvertToTeamPlayerDTOByKey(
          filteredTeamAndPlayers,
          (stat) => stat.point,
          (stat) => stat.matchCount,
          'desc',
          'asc'
        ),
        highestRonPPlayers: sortPlayersAndConvertToTeamPlayerDTOByKey(
          filteredTeamAndPlayers,
          (stat) => stat.ronCount / stat.roundCount,
          (stat) => stat.roundCount,
          'desc',
          'desc'
        ),
        highestRonPurePointPlayers: sortPlayersAndConvertToTeamPlayerDTOByKey(
          filteredTeamAndPlayers,
          (stat) => stat.ronPureScoreAvg,
          (stat) => stat.roundCount,
          'desc',
          'desc'
        ),
        lowestChuckPPlayers: sortPlayersAndConvertToTeamPlayerDTOByKey(
          filteredTeamAndPlayers,
          (stat) => stat.chuckCount / stat.roundCount,
          (stat) => stat.roundCount,
          'asc',
          'desc'
        ),
        highestScoreMax: sortPlayersAndConvertToTeamPlayerDTOByKey(
          filteredTeamAndPlayers,
          (stat) => stat.scoreMax,
          (stat) => stat.roundCount,
          'desc',
          'desc'
        ),
        subslide: 1,
      },
      // {
      //   type: 'heatmap',
      //   _id: 'heatmap',
      //   teams: tournament.teams,
      //   highestTeamPoint: tournament.teams[0].statistics.point,
      //   lowestTeamPoint: tournament.teams.at(-1)!.statistics.point,
      //   highestPlayerPoint:
      //     playersSortedByPoint[0].player.statistics?.point ?? 0,
      //   lowestPlayerPoint:
      //     playersSortedByPoint.at(-1)!.player.statistics?.point ?? 0,
      //   subslide: 1,
      // },
    ]

    if (!autoInSearch) {
      result.unshift({ type: 'empty', _id: 'empty', subslide: 0 })
    }

    return result
  }, [autoInSearch, tournament])

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
    if (!disableClick) {
      handleSlideForward()
    }
  }, [disableClick, handleSlideForward])

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

  if (!tournament) {
    return <></>
  }

  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(to bottom, rgb(30, 34, 59), rgb(16, 18, 33))',
      }}
      onClick={handleClickScreen}
    >
      <div className="absolute inset-0 tournament-realtime-report text-white text-[36px] flex py-[1em] px-[1em] gap-x-[1em]">
        <div className="twr-title flex flex-col justify-start gap-[1em] items-center relative">
          <div>
            <img
              src={tournament.logoUrl + '?w=280&h=280&auto=format'}
              alt={tournament.name}
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
        </div>
      </div>
    </div>
  )
}

export default RealtimeSummaryPage
