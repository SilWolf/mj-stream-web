import MJTeamHistoryChart from '@/components/MJTeamHistoryChart'
import { arrGroupBy } from '@/helpers/array.helper'
import {
  DB_MatchTournament,
  DB_PlayerStatistics,
  DB_Team,
  DB_TeamPlayer,
  TeamPlayerDTO,
  apiGetTeamPlayersOfTournament,
  apiGetTournament,
  formatTeamPlayerDTO,
} from '@/helpers/sanity.helper'
import { renderPoint, renderRanking } from '@/utils/string.util'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'

type Slide =
  | {
      _id: string
      type: 'empty'
      subslide: 0
    }
  | {
      _id: string
      type: 'teams'
      teams: DB_MatchTournament['teams']
      subslide: 1 | 2
    }
  | {
      _id: string
      type: 'chart'
      teams: DB_MatchTournament['teams']
      subslide: 1 | 2
    }
  | {
      _id: string
      type: 'players'
      highestPointPlayers: {
        player: TeamPlayerDTO
        value: number
        tieBreakValue: number
      }[]
      highestRonPPlayers: {
        player: TeamPlayerDTO
        value: number
        tieBreakValue: number
      }[]
      highestRonPurePointPlayers: {
        player: TeamPlayerDTO
        value: number
        tieBreakValue: number
      }[]
      lowestChuckPPlayers: {
        player: TeamPlayerDTO
        value: number
        tieBreakValue: number
      }[]
      highestScoreMax: {
        player: TeamPlayerDTO
        value: number
        tieBreakValue: number
      }[]
      subslide: 1 | 2
    }
  | {
      _id: string
      type: 'heatmap'
      teams: DB_MatchTournament['teams']
      teamPlayersGroupedByTeamIds: Record<string, DB_TeamPlayer[]>
      highestTeamPoint: number
      lowestTeamPoint: number
      highestPlayerPoint: number
      lowestPlayerPoint: number
      subslide: 1 | 2
    }

type Props = {
  params: { week: string }
}

const TOURNAMENT_ID = 'b6908027-9179-485a-8bce-822c42114371'

const sortPlayersAndConvertToTeamPlayerDTOByKey = (
  teamPlayers: Awaited<ReturnType<typeof apiGetTeamPlayersOfTournament>>,
  teamsMap: Record<string, DB_Team>,
  valueFn: (stat: DB_PlayerStatistics) => number,
  tieBreakValueFn: (stat: DB_PlayerStatistics) => number,
  direction: 'asc' | 'desc',
  tieBreakDirection: 'asc' | 'desc'
): {
  player: TeamPlayerDTO
  value: number
  tieBreakValue: number
}[] => {
  return teamPlayers
    .map((teamPlayer) => ({
      player: formatTeamPlayerDTO(teamsMap[teamPlayer.teamId], {
        ...teamPlayer,
        team: teamsMap[teamPlayer.teamId],
      }),
      value: valueFn(teamPlayer.player.statistics!),
      tieBreakValue: tieBreakValueFn(teamPlayer.player.statistics!),
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

const TeamRankingUpOrDownSpan = ({ value }: { value: number | undefined }) => {
  if (typeof value === 'undefined') {
    return <></>
  }

  if (value > 0) {
    return (
      <span className="text-red-500">
        <i className="bi bi-caret-down-fill"></i>{' '}
        <span className="-m-2">{value}</span>
      </span>
    )
  }

  if (value < 0) {
    return (
      <span className="text-green-400">
        <i className="bi bi-caret-up-fill"></i>{' '}
        <span className="-m-2">{Math.abs(value)}</span>
      </span>
    )
  }

  return (
    <span>
      <i className="bi bi-dash"></i> <span className="-m-2">0</span>
    </span>
  )
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
        <div className="flex-1 flex items-center text-[0.75em] gap-6 twr-team-ranking-row">
          <p className="flex-1 text-center">排名</p>
          <p className="flex-[5]">隊伍</p>
          <p className="flex-1 text-center">積分</p>
          <p className="flex-1 text-center">與前名差距</p>
          <p className="flex-1 text-center">半莊數</p>
        </div>
        {slide.teams.map((team, index) => (
          <div
            key={team._id}
            className="relative flex-1 flex items-center gap-6 overflow-hidden twr-team-ranking-row"
            style={{
              background: `linear-gradient(to right, ${team.team.color}C0, transparent 105%)`,
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <img
              src={team.team.squareLogoImage + '?w=320&h=320'}
              alt={team.team._id}
              className="absolute left-48 opacity-10 -z-10"
            />
            <p className="flex-1 text-center space-x-2">
              <span>{renderRanking(team.ranking)}</span>
              <TeamRankingUpOrDownSpan
                value={
                  (team.rankingHistories.at(-1) ?? 0) -
                  (team.rankingHistories.at(-3) ?? 0)
                }
              />
            </p>
            <p className="flex-[5]">
              {team.team.name} {team.team.secondaryName}
            </p>
            <p className="flex-1 text-center">{renderPoint(team.point)}</p>
            <p className="flex-1 text-center">
              {index > 0
                ? (slide.teams[index - 1].point - team.point).toFixed(1)
                : '-'}
            </p>
            <p className="flex-1 text-center">
              {team.matchCount}
              <span className="text-[0.75em]">/60</span>
            </p>
          </div>
        ))}
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
          <MJTeamHistoryChart teams={slide.teams} />
        </div>
        <div
          className="flex-1 flex flex-col twr-team-ranking"
          data-active={status === 0}
        >
          {slide.teams.map((team, index) => (
            <div
              key={team._id}
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
              <div>{renderPoint(team.point)}</div>
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
              ({ player, value, tieBreakValue }, index) => (
                <div
                  key={player.playerId}
                  className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center twr-player-ranking-row"
                  style={{
                    background: `linear-gradient(to right, ${player.color}C0, transparent 105%)`,
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <img
                    src={player.teamLogoImageUrl + '?w=320&h=320'}
                    alt={player.teamName}
                    className="absolute left-[3em] opacity-25 -z-10"
                  />
                  <div className="flex items-center justify-between px-[.5em] gap-x-[.5em]">
                    <div className="w-[2.2em]">{renderRanking(index + 1)}</div>
                    <div className="flex-1">
                      <p className="text-[1.5em] leading-[1em]">
                        {player.playerNickname}
                      </p>
                      <p className="text-[.75em] leading-[1em]">
                        {player.playerName}
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
              {slide.highestRonPPlayers.map(({ player, value }) => (
                <div
                  key={player.playerId}
                  className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center"
                  style={{
                    background: `${player.color}20`,
                  }}
                >
                  <img
                    src={player.teamLogoImageUrl + '?w=320&h=320'}
                    alt={player.teamName}
                    className="absolute left-[3em] opacity-5 -z-10"
                  />
                  <div className="flex items-center justify-between px-[.5em] gap-x-[.5em] py-[.25em]">
                    <div className="flex-1">
                      <p className="leading-[1.2em]">{player.playerNickname}</p>
                    </div>
                    <div className="text-right">
                      <p className="leading-[1.2em]">{value.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-[.5em]">
            <p className="text-center">平均打點</p>
            <div className="flex-1 flex flex-col">
              {slide.highestRonPurePointPlayers.map(({ player, value }) => (
                <div
                  key={player.playerId}
                  className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center"
                  style={{
                    background: `${player.color}20`,
                  }}
                >
                  <img
                    src={player.teamLogoImageUrl + '?w=320&h=320'}
                    alt={player.teamName}
                    className="absolute left-[3em] opacity-5 -z-10"
                  />
                  <div className="flex items-center justify-between px-[.5em] gap-x-[.5em] py-[.25em]">
                    <div className="flex-1">
                      <p className="leading-[1.2em]">{player.playerNickname}</p>
                    </div>
                    <div className="text-right">
                      <p className="leading-[1.2em]">{value.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-[.5em]">
            <p className="text-center">銃和率</p>
            <div className="flex-1 flex flex-col">
              {slide.lowestChuckPPlayers.map(({ player, value }) => (
                <div
                  key={player.playerId}
                  className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center"
                  style={{
                    background: `${player.color}20`,
                  }}
                >
                  <img
                    src={player.teamLogoImageUrl + '?w=320&h=320'}
                    alt={player.teamName}
                    className="absolute left-[3em] opacity-5 -z-10"
                  />
                  <div className="flex items-center justify-between px-[.5em] gap-x-[.5em] py-[.25em]">
                    <div className="flex-1">
                      <p className="leading-[1.2em]">{player.playerNickname}</p>
                    </div>
                    <div className="text-right">
                      <p className="leading-[1.2em]">{value.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-[.5em]">
            <p className="text-center">最高得點</p>
            <div className="flex-1 flex flex-col">
              {slide.highestScoreMax.map(({ player, value }) => (
                <div
                  key={player.playerId}
                  className="relative overflow-hidden flex-1 flex flex-col items-stretch justify-center"
                  style={{
                    background: `${player.color}20`,
                  }}
                >
                  <img
                    src={player.teamLogoImageUrl + '?w=320&h=320'}
                    alt={player.teamName}
                    className="absolute left-[3em] opacity-5 -z-10"
                  />
                  <div className="flex items-center justify-between px-[.5em] gap-x-[.5em] py-[.25em]">
                    <div className="flex-1">
                      <p className="leading-[1.2em]">{player.playerNickname}</p>
                    </div>
                    <div className="text-right">
                      <p className="leading-[1.2em]">{value.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  } else if (slide.type === 'heatmap') {
    return (
      <div
        className="absolute inset-0 flex gap-[1em] items-stretch twr-heatmap"
        data-active={status === 0}
        style={{
          opacity: status >= 0 && status < 1 ? 1 : 0,
        }}
      >
        <div className="flex-1 flex flex-col gap-y-[.5em]">
          <h4 className="text-[2em] font-semibold text-center leading-[1em] twr-heatmap-title">
            點數熱力圖
          </h4>
          <p className="text-center mb-8 twr-heatmap-title">
            <span className="bg-green-500 px-1">綠色</span>
            代表高分、
            <span className="bg-red-500 px-1">紅色</span>代表低分
          </p>
          <div className="grid grid-cols-12 flex-1 text-center text-[.8em]">
            {slide.teams.map((team, teamIndex) => (
              <div
                className="h-20 twr-heatmap-cell"
                key={team.team._id}
                style={{
                  animationDelay: teamIndex * 0.05 + 's',
                }}
              >
                <div
                  style={{
                    background: `${team.team.color}80`,
                  }}
                >
                  <img
                    src={team.team.squareLogoImage + '?w=128&h=128'}
                    alt={team.team.name}
                    className="h-24 w-24 my-2 inline-block"
                  />
                </div>
                <p
                  className="py-2"
                  style={{
                    background:
                      team.point > 0
                        ? `rgba(23, 235, 0, ${
                            team.point / slide.highestTeamPoint
                          })`
                        : `rgba(235, 0, 0, ${
                            team.point / slide.lowestTeamPoint
                          })`,
                  }}
                >
                  {renderPoint(team.point)}
                </p>
              </div>
            ))}
            {([0, 1, 2, 3] as const).map((index) =>
              slide.teams.map((team, teamIndex) => (
                <div
                  className="flex items-center justify-center twr-heatmap-cell"
                  key={team.team._id}
                  style={{
                    background:
                      typeof slide.teamPlayersGroupedByTeamIds[team.team._id][
                        index
                      ].player.statistics?.point !== 'undefined'
                        ? slide.teamPlayersGroupedByTeamIds[team.team._id][
                            index
                          ].player.statistics!.point > 0
                          ? `rgba(23, 235, 0, ${
                              slide.teamPlayersGroupedByTeamIds[team.team._id][
                                index
                              ].player.statistics!.point /
                              slide.highestPlayerPoint
                            })`
                          : `rgba(235, 0, 0, ${
                              slide.teamPlayersGroupedByTeamIds[team.team._id][
                                index
                              ].player.statistics!.point /
                              slide.lowestPlayerPoint
                            })`
                        : 'tranparent',
                    animationDelay: (teamIndex + index + 1) * 0.05 + 's',
                  }}
                >
                  {renderPoint(
                    slide.teamPlayersGroupedByTeamIds[team.team._id][index]
                      .player.statistics?.point
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  return <></>
}

const TournamentDetailPage = ({ params: { week } }: Props) => {
  // const weekNum = useMemo(() => parseInt(week) ?? 1, [week])
  const [periodStartDate, periodEndDate] = useMemo(() => {
    // const date = new Date('2024-01-09')

    // date.setDate(date.getDate() + (weekNum - 1) * 7)
    // const start = `${date.getDate()}/${date.getMonth() + 1}`

    // date.setDate(date.getDate() + 2)
    // const end = `${date.getDate()}/${date.getMonth() + 1}`

    // return [start, end]
    return ['16/1', '18/1']
  }, [])

  const { data: tournament } = useQuery({
    queryKey: ['tournament', TOURNAMENT_ID],
    queryFn: () =>
      apiGetTournament(TOURNAMENT_ID as string).then((tournament) => ({
        ...tournament,
        teams: tournament.teams.sort((a, b) => b.point - a.point),
      })),
    enabled: !!TOURNAMENT_ID,
  })

  const { data: teamPlayers } = useQuery({
    queryKey: ['tournament', TOURNAMENT_ID, 'players'],
    queryFn: () => apiGetTeamPlayersOfTournament(TOURNAMENT_ID as string),
    enabled: !!TOURNAMENT_ID,
  })

  const teamsMap = useMemo(() => {
    if (!tournament) {
      return {}
    }

    return tournament.teams.reduce(
      (prev, { team }) => {
        prev[team._id] = team
        return prev
      },
      {} as Record<string, DB_Team>
    )
  }, [tournament])

  const [slideIndex, setSlideIndex] = useState<number>(0)
  const [subSlideIndex, setSubSlideIndex] = useState<number>(0)
  const [isSlideChanging, setIsSlideChanging] = useState<boolean>(false)

  const slides = useMemo<Slide[]>(() => {
    if (!tournament || !teamPlayers) {
      return [{ type: 'empty', _id: 'empty', subslide: 0 }]
    }

    const filteredTeamPlayers = teamPlayers.filter(
      (teamPlayer) => teamPlayer.player.statistics!.matchCount > 0
    )

    const teamPlayersSortedByPoint = teamPlayers.sort(
      (a, b) =>
        (b.player.statistics?.point ?? 0) - (a.player.statistics?.point ?? 0)
    )

    return [
      { type: 'empty', _id: 'empty', subslide: 0 },
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
          filteredTeamPlayers,
          teamsMap,
          (stat) => stat.point,
          (stat) => stat.matchCount,
          'desc',
          'asc'
        ),
        highestRonPPlayers: sortPlayersAndConvertToTeamPlayerDTOByKey(
          filteredTeamPlayers,
          teamsMap,
          (stat) => stat.ronCount / stat.roundCount,
          (stat) => stat.roundCount,
          'desc',
          'desc'
        ),
        highestRonPurePointPlayers: sortPlayersAndConvertToTeamPlayerDTOByKey(
          filteredTeamPlayers,
          teamsMap,
          (stat) => stat.ronPureScoreAvg,
          (stat) => stat.roundCount,
          'desc',
          'desc'
        ),
        lowestChuckPPlayers: sortPlayersAndConvertToTeamPlayerDTOByKey(
          filteredTeamPlayers,
          teamsMap,
          (stat) => stat.chuckCount / stat.roundCount,
          (stat) => stat.roundCount,
          'asc',
          'desc'
        ),
        highestScoreMax: sortPlayersAndConvertToTeamPlayerDTOByKey(
          filteredTeamPlayers,
          teamsMap,
          (stat) => stat.scoreMax,
          (stat) => stat.roundCount,
          'desc',
          'desc'
        ),
        subslide: 1,
      },
      {
        type: 'heatmap',
        _id: 'heatmap',
        teams: tournament.teams,
        teamPlayersGroupedByTeamIds: arrGroupBy(
          teamPlayersSortedByPoint,
          (item: any) => item.teamId
        ),
        highestTeamPoint: tournament.teams[0].point,
        lowestTeamPoint: tournament.teams.at(-1)!.point,
        highestPlayerPoint:
          teamPlayersSortedByPoint[0].player.statistics?.point ?? 0,
        lowestPlayerPoint:
          teamPlayersSortedByPoint.at(-1)!.player.statistics?.point ?? 0,
        subslide: 1,
      },
    ]
  }, [teamPlayers, teamsMap, tournament])

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
        setSlideIndex((prev) => Math.ceil(prev))
        setSubSlideIndex(0)
        setIsSlideChanging(false)
      }, 1200)
    } else {
      setSubSlideIndex((prev) => prev + 0.5)
      setIsSlideChanging(true)

      setTimeout(() => {
        setSubSlideIndex((prev) => Math.ceil(prev))
        setIsSlideChanging(false)
      }, 1200)
    }
  }, [isSlideChanging, slideIndex, slides, subSlideIndex])

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
      onClick={handleSlideForward}
    >
      <div className="absolute inset-0 tournament-weekly-report text-white text-[36px] flex py-[1em] px-[1em] gap-x-[1em]">
        <div className="twr-title flex flex-col justify-between items-center">
          <div>
            <img
              src={tournament.logoUrl + '?w=280&h=280&auto=format'}
              alt={tournament.name}
              style={{ width: '3.5em', height: '3.5em', marginTop: '0.15em' }}
            />
          </div>
          <p
            style={{
              fontSize: '3em',
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
            }}
          >
            第
            <span
              style={{
                writingMode: 'initial',
                textOrientation: 'initial',
              }}
            >
              {week}
            </span>
            週結算
          </p>
          <p
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
          </p>
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

export default TournamentDetailPage
