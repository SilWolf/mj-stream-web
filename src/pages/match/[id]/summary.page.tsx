import { renderPoint, renderRanking, renderScore } from '@/utils/string.util'
import { useCallback, useEffect, useMemo, useState } from 'react'
import cns from 'classnames'
import MJMatchHistoryChart from '@/components/MJMatchHistoryChart'
import useMatch from '@/hooks/useMatch'
import { convertMatchToExportedMatch } from '@/helpers/mahjong.helper'
import useDbMatch from '@/hooks/useDbMatch'
import {
  DB_Team,
  TeamPlayerDTO,
  apiGetTournament,
} from '@/helpers/sanity.helper'
import { useQuery } from '@tanstack/react-query'

type Props = {
  params: { matchId: string }
  forwardFlag?: number
  resetFlag?: number
  disableClick?: boolean
}

type Slide =
  | {
      _id: string
      type: 'empty'
      subslide: 0
    }
  | {
      _id: string
      type: 'teams'
      teams: Record<
        'playerEast' | 'playerSouth' | 'playerWest' | 'playerNorth',
        TeamPlayerDTO & {
          color: string
          point: number
          ranking: string
        }
      >
      subslide: 1 | 2
    }
  | {
      _id: string
      type: 'players'
      teamPlayers: (TeamPlayerDTO & {
        result: {
          score: number
          point: number
          ranking: string
          ronCount: number
          riichiCount: number
          chuckCount: number
        }
      })[]
      roundCount: number
      exhaustedRoundCount: number
      subslide: 1
    }
  | {
      _id: string
      type: 'chart'
      rounds: {
        name: string
        playerEast: number
        playerSouth: number
        playerWest: number
        playerNorth: number
      }[]
      players: Record<
        'playerEast' | 'playerSouth' | 'playerWest' | 'playerNorth',
        { name: string; color: string }
      >
      teamPlayers: (TeamPlayerDTO & {
        result: {
          score: number
          point: number
          ranking: string
          ronCount: number
          riichiCount: number
          chuckCount: number
        }
      })[]
      subslide: 1
    }
  | {
      _id: string
      type: 'ranking'
      teams: {
        _id: string
        point: number
        ranking: number
        matchCount: number
        team: DB_Team
        newResult?: {
          point: number
          matchCount: number
        }
      }[]
      subslide: 1
    }

const MatchSummarySlide = ({
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
        className="absolute px-24 inset-0 flex flex-col justify-center items-stretch"
        style={{
          opacity: status >= 0 && status < 1 ? 1 : 0,
        }}
      >
        <div className="flex-1"></div>
        <div className="flex-[2] grid grid-cols-4 items-center">
          {(
            ['playerEast', 'playerSouth', 'playerWest', 'playerNorth'] as const
          ).map((playerKey, index) => (
            <div
              key={playerKey}
              className={cns('relative h-full overflow-hidden', {
                'mi-teams-in': status === 0,
                'mi-teams-out': status > 0,
              })}
              style={{
                animationDelay: status === 0 ? index * 0.25 + 's' : '0s',
                filter:
                  slide.teams[playerKey].ranking !== '1'
                    ? 'grayscale(1)'
                    : 'grayscale(0)',
              }}
            >
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${slide.teams[playerKey].color})`,
                  opacity: 0.5,
                }}
              ></div>
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background: `url(${
                    slide.teams[playerKey].teamLogoImageUrl +
                    '?w=800&h=800&auto=format'
                  })`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                  opacity: 0.05,
                }}
              ></div>
              <div
                className={cns('absolute inset-0', {
                  'mi-teams-team-out': status >= 0 && subslide > 0,
                })}
              >
                <img
                  src={
                    slide.teams[playerKey].teamLogoImageUrl +
                    '?w=800&h=800&auto=format'
                  }
                  className="aspect-square w-full"
                  alt=""
                />
                <h3 className="text-[1.5em] font-semibold text-center">
                  {slide.teams[playerKey].teamName}
                </h3>
                <h3 className="text-[1em] h-[2em] font-semibold text-center">
                  {slide.teams[playerKey].teamSecondaryName}
                </h3>
                <h3 className="text-[1.5em] font-semibold text-center flex justify-between px-[.5em]">
                  <span>{renderRanking(slide.teams[playerKey].ranking)}</span>
                  <span>{renderPoint(slide.teams[playerKey].point)}</span>
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  } else if (slide.type === 'players') {
    return (
      <div
        className="absolute px-24 pb-24 inset-0 flex flex-col justify-center items-stretch"
        style={{
          opacity: status >= 0 && status < 1 ? 1 : 0,
        }}
      >
        <div className="flex-1"></div>
        <div className="flex-[3] flex flex-col items-stretch">
          <div
            className={cns('flex gap-x-[1em] pl-[1em] mb-[.5em] items-end', {
              'mi-teams-in': status === 0,
              'mi-teams-out': status > 0,
            })}
          >
            <div className="flex-[5] space-x-[1.5em] text-[1.1em]">
              <span>
                <span className="text-[1.5em]">{slide.roundCount}</span> 總局數
              </span>
              <span className="opacity-80">
                （{' '}
                <span className="text-[1.5em]">
                  {slide.exhaustedRoundCount}
                </span>{' '}
                流局數 ）
              </span>
            </div>
            <div className="flex-1 text-right text-[.9em] font-semibold">
              分數
            </div>
            <div className="flex-1 text-right text-[.9em] font-semibold">
              立直次數
            </div>
            <div className="flex-1 text-right text-[.9em] font-semibold">
              和了次數
            </div>
            <div className="flex-1 text-right text-[.9em] font-semibold">
              放銃次數
            </div>
          </div>
          {slide.teamPlayers.map((teamPlayer, index) => (
            <div
              key={teamPlayer.teamName}
              className={cns('relative overflow-hidden flex-1', {
                'mi-teams-in': status === 0,
                'mi-teams-out': status > 0,
              })}
              style={{
                animationDelay: status === 0 ? index * 0.25 + 's' : '0s',
              }}
            >
              <div
                key={teamPlayer.teamName}
                className="absolute inset-0 -z-10"
                style={{
                  background: `linear-gradient(to left, transparent, ${teamPlayer.color})`,
                  opacity: 0.5,
                }}
              ></div>
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background: `url(${
                    teamPlayer.teamLogoImageUrl + '?w=800&h=800&auto=format'
                  })`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                  opacity: 0.05,
                }}
              ></div>
              <div
                className={cns(
                  'absolute inset-0 flex gap-x-[1em] items-center pl-[1em]',
                  {
                    'mi-teams-team-out': status >= 0 && subslide > 0,
                  }
                )}
              >
                <div className="text-left flex-[5]">
                  <h3 className="text-[1.5em] font-semibold">
                    {teamPlayer.playerFullname}
                  </h3>
                  <h3 className="text-[.8em] font-semibold">
                    {teamPlayer.teamFullname}
                  </h3>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[1.5em] leading-[1em]">
                    {renderScore(teamPlayer.result.score)}
                  </p>
                  <p>{renderPoint(teamPlayer.result.point)}</p>
                </div>
                <div className="flex-1 text-right">
                  <span className="text-[1.5em]">
                    {renderScore(teamPlayer.result.riichiCount)}
                  </span>
                  回
                </div>
                <div className="flex-1 text-right">
                  <span className="text-[1.5em]">
                    {renderScore(teamPlayer.result.ronCount)}
                  </span>
                  回
                </div>
                <div className="flex-1 text-right">
                  <span className="text-[1.5em]">
                    {renderScore(teamPlayer.result.chuckCount)}
                  </span>
                  回
                </div>
              </div>
              {/* <div
                className={cns('absolute inset-0 opacity-0', {
                  'mi-teams-player-in': status >= 0 && subslide >= 1,
                  'mi-teams-player-out': status > 0,
                })}
                style={{
                  animationDelay: status === 0 ? index * 0.25 + 's' : '0s',
                }}
              >
                <img
                  src={
                    teamPlayer.playerPortraitImageUrl +
                    '?w=360&h=500&auto=format'
                  }
                  className="aspect-[18/25] w-full"
                  alt=""
                />
                <div className="font-semibold text-center">
                  <p className="text-[1em]">{teamPlayer.playerNickname}</p>
                  <p className="text-[.8em]">{teamPlayer.playerName}</p>
                </div>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    )
  } else if (slide.type === 'chart') {
    return (
      <div
        className="absolute py-16 px-24 inset-0 flex flex-col justify-center items-stretch"
        style={{
          opacity: status >= 0 && status < 1 ? 1 : 0,
        }}
      >
        <div className="flex-1"></div>
        <div className="flex-[3] flex items-stretch gap-x-[1em]">
          <div
            className={cns('flex-[3]', {
              'mi-chart-chart-in': status === 0,
              'mi-chart-chart-out': status > 0,
            })}
          >
            <MJMatchHistoryChart
              rounds={slide.rounds}
              players={slide.players}
            />
          </div>
          <div className="flex-1 flex flex-col pb-[1em]">
            {[0, 1, 2, 3].map((index) => (
              <div
                className={cns(
                  'relative overflow-hidden flex-1 pl-[.5em] flex flex-col justify-center',
                  {
                    'mi-chart-player-in': status === 0,
                    'mi-chart-player-out': status > 0,
                  }
                )}
                style={{
                  background: `linear-gradient(to left, transparent, ${slide.teamPlayers[index].color}C0)`,
                  animationDelay: status === 0 ? index * 0.25 + 's' : '0s',
                }}
              >
                <img
                  src={
                    slide.teamPlayers[index].teamLogoImageUrl + '?w=320&h=320'
                  }
                  alt={slide.teamPlayers[index].teamId}
                  className="absolute left-0 opacity-10 -z-10"
                />
                <div className="flex justify-between">
                  <div>
                    <p className="text-[1.5em] leading-[1em]">
                      {slide.teamPlayers[index].playerNickname}
                    </p>
                    <p className="text-[.75em]">
                      {slide.teamPlayers[index].teamName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[1.5em] leading-[1em]">
                      {slide.teamPlayers[index].result.score}
                    </p>
                    <p className="text-[.75em]">
                      {renderPoint(slide.teamPlayers[index].result.point)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  } else if (slide.type === 'ranking') {
    return (
      <div
        className="absolute py-16 px-24 inset-0 flex flex-col justify-center items-stretch"
        style={{
          opacity: status >= 0 && status < 1 ? 1 : 0,
        }}
      >
        <div className="flex-1"></div>
        <div
          className={cns('flex-[5] flex flex-col', {
            'mi-ranking-ranking-in': status === 0,
            'mi-ranking-ranking-out': status > 0,
          })}
        >
          <div className="flex-1 flex items-center text-[0.75em] gap-6">
            <p className="flex-1 text-center">排名</p>
            <p className="flex-[5]">隊伍</p>
            <p className="flex-1 text-right">積分</p>
            <p className="flex-1 text-right">與前名差距</p>
            <p className="flex-1 text-right">半莊數</p>
          </div>
          {slide.teams.map((team, index) => (
            <div
              key={team._id}
              className={cns(
                'relative flex-1 flex items-center gap-6 overflow-hidden',
                {
                  'mi-ranking-ranking-in': status === 0,
                  'mi-ranking-ranking-out': status > 0,
                }
              )}
              style={{
                background: `linear-gradient(to right, ${team.team.color}C0, transparent 105%)`,
                animationDelay: `${index * 0.05}s`,
                opacity: team.newResult ? 1 : 0.3,
              }}
            >
              <img
                src={team.team.squareLogoImage + '?w=320&h=320'}
                alt={team.team._id}
                className="absolute left-0 opacity-25 -z-10"
              />
              <div className="absolute left-[.5em]">
                {team.ranking > index + 1 && (
                  <span>
                    <i className="bi bi-caret-up-fill text-green-500"></i>
                  </span>
                )}
                {team.ranking < index + 1 && (
                  <span>
                    <i className="bi bi-caret-down-fill text-red-500"></i>
                  </span>
                )}
              </div>
              <p className="flex-1 text-center space-x-1">
                <span>{renderRanking(index + 1)}</span>
              </p>
              <p className="flex-[5]">
                {team.team.name} {team.team.secondaryName}
              </p>
              <p
                className={cns('flex-1 text-right', {
                  'text-green-500':
                    team.newResult && team.newResult.point > team.point,
                  'text-red-500':
                    team.newResult && team.newResult.point < team.point,
                })}
              >
                {renderPoint(team.newResult?.point || team.point)}
              </p>
              <p className="flex-1 text-right">
                {index > 0
                  ? (
                      (slide.teams[index - 1].newResult?.point ||
                        slide.teams[index - 1].point) -
                      (team.newResult?.point || team.point)
                    ).toFixed(1)
                  : '-'}
              </p>
              <p className="flex-1 text-right">
                {team.newResult?.matchCount || team.matchCount}
                <span className="text-[0.75em]">/60</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return <></>
}

const MatchSummaryPage = ({
  params: { matchId },
  forwardFlag,
  resetFlag,
  disableClick,
}: Props) => {
  const { match, matchRounds } = useMatch(matchId)
  const { data: matchDTO } = useDbMatch(matchId)

  const { data: tournament } = useQuery({
    queryKey: ['tournament', matchDTO?.tournament._id as string],
    queryFn: () =>
      apiGetTournament(matchDTO?.tournament._id as string).then(
        (tournament) => ({
          ...tournament,
          teams: tournament.teams.sort((a, b) => b.point - a.point),
        })
      ),
    enabled: !!matchDTO?.tournament._id,
  })

  const slides = useMemo<Slide[]>(() => {
    if (!match || !matchRounds || !matchDTO || !tournament) {
      return [{ type: 'empty', _id: 'empty', subslide: 0 }]
    }

    const exportedMatch = convertMatchToExportedMatch(
      Object.values(matchRounds)
    )

    const resultSlides: Slide[] = [
      { type: 'empty', _id: 'empty', subslide: 0 },
      {
        type: 'teams',
        _id: 'teams',
        teams: {
          playerEast: {
            ...matchDTO.playerEast,
            point: exportedMatch.result.playerEast.point,
            ranking: exportedMatch.result.playerEast.ranking,
          },
          playerSouth: {
            ...matchDTO.playerSouth,
            point: exportedMatch.result.playerSouth.point,
            ranking: exportedMatch.result.playerSouth.ranking,
          },
          playerWest: {
            ...matchDTO.playerWest,
            point: exportedMatch.result.playerWest.point,
            ranking: exportedMatch.result.playerWest.ranking,
          },
          playerNorth: {
            ...matchDTO.playerNorth,
            point: exportedMatch.result.playerNorth.point,
            ranking: exportedMatch.result.playerNorth.ranking,
          },
        },
        subslide: 1,
      },
    ]

    const playersStat = {
      playerEast: {
        score: exportedMatch.result.playerEast?.score ?? 25000,
        point: exportedMatch.result.playerEast?.point ?? 0,
        ranking: exportedMatch.result.playerEast?.ranking ?? '1',
        ronCount: 0,
        riichiCount: 0,
        chuckCount: 0,
        scores: [25000],
      },
      playerSouth: {
        score: exportedMatch.result.playerSouth?.score ?? 25000,
        point: exportedMatch.result.playerSouth?.point ?? 0,
        ranking: exportedMatch.result.playerSouth?.ranking ?? '1',
        ronCount: 0,
        riichiCount: 0,
        chuckCount: 0,
        scores: [25000],
      },
      playerWest: {
        score: exportedMatch.result.playerWest?.score ?? 25000,
        point: exportedMatch.result.playerWest?.point ?? 0,
        ranking: exportedMatch.result.playerWest?.ranking ?? '1',
        ronCount: 0,
        riichiCount: 0,
        chuckCount: 0,
        scores: [25000],
      },
      playerNorth: {
        score: exportedMatch.result.playerNorth?.score ?? 25000,
        point: exportedMatch.result.playerNorth?.point ?? 0,
        ranking: exportedMatch.result.playerNorth?.ranking ?? '1',
        ronCount: 0,
        riichiCount: 0,
        chuckCount: 0,
        scores: [25000],
      },
    }

    for (const round of exportedMatch.rounds) {
      playersStat.playerEast.scores.push(round.playerEast.afterScore)
      playersStat.playerSouth.scores.push(round.playerSouth.afterScore)
      playersStat.playerWest.scores.push(round.playerWest.afterScore)
      playersStat.playerNorth.scores.push(round.playerNorth.afterScore)

      if (round.playerEast.status === 'isRiichied') {
        playersStat.playerEast.riichiCount += 1
      }
      if (round.playerSouth.status === 'isRiichied') {
        playersStat.playerSouth.riichiCount += 1
      }
      if (round.playerWest.status === 'isRiichied') {
        playersStat.playerWest.riichiCount += 1
      }
      if (round.playerNorth.status === 'isRiichied') {
        playersStat.playerNorth.riichiCount += 1
      }

      if (round.type === 'ron' || round.type === 'tsumo') {
        if (round.playerEast.type === 'win') {
          playersStat.playerEast.ronCount += 1
        }
        if (round.playerSouth.type === 'win') {
          playersStat.playerSouth.ronCount += 1
        }
        if (round.playerWest.type === 'win') {
          playersStat.playerWest.ronCount += 1
        }
        if (round.playerNorth.type === 'win') {
          playersStat.playerNorth.ronCount += 1
        }
      }

      if (round.type === 'ron') {
        if (round.playerEast.type === 'lose') {
          playersStat.playerEast.chuckCount += 1
        }
        if (round.playerSouth.type === 'lose') {
          playersStat.playerSouth.chuckCount += 1
        }
        if (round.playerWest.type === 'lose') {
          playersStat.playerWest.chuckCount += 1
        }
        if (round.playerNorth.type === 'lose') {
          playersStat.playerNorth.chuckCount += 1
        }
      }
    }

    const sortedTeamPlayers = [
      {
        ...matchDTO.playerEast,
        result: playersStat.playerEast,
      },
      {
        ...matchDTO.playerSouth,
        result: playersStat.playerSouth,
      },
      {
        ...matchDTO.playerWest,
        result: playersStat.playerWest,
      },
      {
        ...matchDTO.playerNorth,
        result: playersStat.playerNorth,
      },
    ].sort((a, b) => b.result.score - a.result.score)

    resultSlides.push({
      type: 'players',
      _id: 'players',
      teamPlayers: sortedTeamPlayers,
      roundCount: exportedMatch.rounds?.length ?? 0,
      exhaustedRoundCount:
        exportedMatch.rounds?.filter((round) => round.type === 'exhausted')
          .length ?? 0,
      subslide: 1,
    })

    const firstSouthRoundIndex = exportedMatch.rounds.findIndex((round) =>
      round.code.startsWith('5.')
    )

    resultSlides.push({
      type: 'chart',
      _id: 'chart',
      rounds: [
        {
          name: '東',
          playerEast: 25000,
          playerSouth: 25000,
          playerWest: 25000,
          playerNorth: 25000,
        },
        ...exportedMatch.rounds.map((round, roundIndex) => ({
          name: roundIndex === firstSouthRoundIndex ? '南' : '',
          playerEast: round.playerEast.afterScore,
          playerSouth: round.playerSouth.afterScore,
          playerWest: round.playerWest.afterScore,
          playerNorth: round.playerNorth.afterScore,
        })),
      ],
      players: {
        playerEast: {
          name: matchDTO.playerEast.playerNickname,
          color: matchDTO.playerEast.color,
        },
        playerSouth: {
          name: matchDTO.playerSouth.playerNickname,
          color: matchDTO.playerSouth.color,
        },
        playerWest: {
          name: matchDTO.playerWest.playerNickname,
          color: matchDTO.playerWest.color,
        },
        playerNorth: {
          name: matchDTO.playerNorth.playerNickname,
          color: matchDTO.playerNorth.color,
        },
      },
      teamPlayers: sortedTeamPlayers,
      subslide: 1,
    })

    const playerKeys = [
      'playerEast',
      'playerSouth',
      'playerWest',
      'playerNorth',
    ] as const
    const newTeams: {
      _id: string
      point: number
      ranking: number
      matchCount: number
      team: DB_Team
      newResult?: {
        point: number
        matchCount: number
      }
    }[] = [...tournament.teams].map((team) => {
      for (const playerKey of playerKeys) {
        if (team.team._id === matchDTO[playerKey].teamId) {
          return {
            ...team,
            newResult: {
              point:
                team.point +
                exportedMatch.result[playerKey].point +
                exportedMatch.result[playerKey].penalty,
              matchCount: team.matchCount + 1,
            },
          }
        }
      }

      return team
    })

    resultSlides.push({
      _id: 'ranking',
      type: 'ranking',
      teams: newTeams.sort(
        (a, b) =>
          (b.newResult?.point || b.point) - (a.newResult?.point || a.point)
      ),
      subslide: 1,
    })

    return resultSlides
  }, [match, matchDTO, matchRounds, tournament])

  const [slideIndex, setSlideIndex] = useState<number>(0)
  const [subSlideIndex, setSubSlideIndex] = useState<number>(0)
  const [isSlideChanging, setIsSlideChanging] = useState<boolean>(false)

  const [prevForwardFlag, setPrevForwardFlag] = useState<number>(
    forwardFlag ?? 0
  )
  const [prevResetFlag, setPrevResetFlag] = useState<number>(resetFlag ?? 0)

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

  if (!match || !matchRounds || !matchDTO || !tournament) {
    return <></>
  }

  return (
    <div
      className="match-introduction fixed inset-0 text-white text-[36px]"
      style={{
        background:
          'linear-gradient(to bottom, rgb(30, 34, 59), rgb(16, 18, 33))',
      }}
      onClick={handleClickScreen}
    >
      <div className="absolute py-16 px-24 inset-0">
        <div className="flex items-end gap-x-[0.25em] mi-title-in">
          <div>
            <img
              src={matchDTO.tournament.logoUrl + '?w=280&h=280&auto=format'}
              alt={matchDTO.tournament.name}
              style={{ width: '3.5em', height: '3.5em', marginTop: '0.15em' }}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-[1.25em] leading-[1em]">
              {matchDTO.tournament.name}
            </h3>
            <h1 className="text-[2em] leading-[1.2em] font-semibold">
              {matchDTO.nameAlt}
            </h1>
          </div>
          <div>
            <h1 className="text-[2em] leading-[1.2em] font-semibold">
              對局結果
            </h1>
          </div>
        </div>
        {/* <h1 className="text-[2.2em] leading-[1.2em] font-semibold mi-subbtitle-in">
          {matchDTO.name}
        </h1> */}
      </div>
      {slides.map((slide, index) => (
        <MatchSummarySlide
          key={slide._id}
          slide={slide}
          status={slideIndex - index}
          subslide={subSlideIndex}
        />
      ))}
    </div>
  )
}

export default MatchSummaryPage
