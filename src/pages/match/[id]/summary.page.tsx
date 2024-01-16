import { renderPoint, renderRanking, renderScore } from '@/utils/string.util'
import { useCallback, useMemo, useState } from 'react'
import cns from 'classnames'
import MJMatchHistoryChart from '@/components/MJMatchHistoryChart'
import useMatch from '@/hooks/useMatch'
import { convertMatchToExportedMatch } from '@/helpers/mahjong.helper'
import useDbMatch from '@/hooks/useDbMatch'
import { TeamPlayerDTO } from '@/helpers/sanity.helper'

type Props = {
  params: { matchId: string }
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
            className={cns('flex gap-x-[1em] pl-[1em] mb-[.5em]', {
              'mi-teams-in': status === 0,
              'mi-teams-out': status > 0,
            })}
          >
            <div className="flex-[5]"></div>
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
                    {teamPlayer.playerName} ({teamPlayer.playerNickname})
                  </h3>
                  <h3 className="text-[.8em] font-semibold">
                    {teamPlayer.teamName}
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
                className={cns('flex-1 pl-[1em] flex flex-col justify-center', {
                  'mi-chart-player-in': status === 0,
                  'mi-chart-player-out': status > 0,
                })}
                style={{
                  background: `linear-gradient(to left, transparent, ${slide.teamPlayers[index].color}C0)`,
                  animationDelay: status === 0 ? index * 0.25 + 's' : '0s',
                }}
              >
                <p className="text-[1.5em] leading-[1em]">
                  {slide.teamPlayers[index].playerNickname}
                </p>
                <p className="text-[.75em]">
                  {slide.teamPlayers[index].teamName}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return <></>
}

const MatchSummaryPage = ({ params: { matchId } }: Props) => {
  const { match, matchRounds } = useMatch(matchId)
  const { data: matchDTO } = useDbMatch(matchId)

  const slides = useMemo<Slide[]>(() => {
    if (!match || !matchRounds || !matchDTO) {
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
      subslide: 1,
    })

    resultSlides.push({
      type: 'chart',
      _id: 'chart',
      rounds: [
        {
          name: '',
          playerEast: 25000,
          playerSouth: 25000,
          playerWest: 25000,
          playerNorth: 25000,
        },
        ...exportedMatch.rounds.map((round) => ({
          name:
            round.code === '1.0'
              ? '東一局'
              : round.code === '5.0'
              ? '南一局'
              : '',
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

    return resultSlides
  }, [match, matchDTO, matchRounds])

  const [slideIndex, setSlideIndex] = useState<number>(0)
  const [subSlideIndex, setSubSlideIndex] = useState<number>(0)
  const [isSlideChanging, setIsSlideChanging] = useState<boolean>(false)

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

  if (!match || !matchRounds || !matchDTO) {
    return <></>
  }

  return (
    <div
      className="match-introduction fixed inset-0 text-white text-[36px]"
      style={{
        background:
          'linear-gradient(to bottom, rgb(30, 34, 59), rgb(16, 18, 33))',
      }}
      onClick={handleSlideForward}
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
              常規賽 {matchDTO.startAt?.substring(0, 10)}
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
