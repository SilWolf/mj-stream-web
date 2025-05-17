import { renderPoint, renderRanking, renderScore } from '@/utils/string.util'
import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react'
import cns from 'classnames'
import MJMatchHistoryChart from '@/components/MJMatchHistoryChart'
import useRealtimeMatch from '@/hooks/useRealtimeMatch'
import { convertMatchToExportedMatch } from '@/helpers/mahjong.helper'
import { RealtimePlayer } from '@/models'

import styles from './index.module.css'
import { apiGetTournamentById } from '@/pages/v2/services/tournament.service'
import { useQuery } from '@tanstack/react-query'
import PlayerCardInRanking from './components/PlayerCardInRanking'
import { V2MatchPlayer } from '@/pages/v2/models/V2Match.model'
import useDbMatchV2 from '@/hooks/useDbMatchV2'

const rankingColors = [
  { strokeColor: '#77475b', bgColor: '#562135C0', color: '#f9dddc' },
  { strokeColor: '#c68fa7', bgColor: '#c3829eC0', color: '#77475b' },
  { strokeColor: '#e4b2ca', bgColor: '#e9b1cdC0', color: '#77475b' },
  { strokeColor: '#f9dddc', bgColor: '#ffe7deC0', color: '#77475b' },
]

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
      teamAndPlayers: Record<
        'playerEast' | 'playerSouth' | 'playerWest' | 'playerNorth',
        {
          player: RealtimePlayer
          result: {
            point: number
            ranking: string
          }
        }
      >
      subslide: 1 | 2
    }
  | {
      _id: string
      type: 'players'
      teamAndPlayers: {
        player: RealtimePlayer
        result: {
          score: number
          point: number
          ranking: string
          ronCount: number
          riichiCount: number
          chuckCount: number
        }
      }[]
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
        { name: string; strokeColor: string; color: string }
      >
      teamAndPlayers: {
        player: RealtimePlayer
        result: {
          score: number
          point: number
          ranking: string
          ronCount: number
          riichiCount: number
          chuckCount: number
        }
      }[]
      subslide: 1
    }
  | {
      _id: string
      type: 'grand-ranking'
      players: { player: V2MatchPlayer; point: number; active: boolean }[]
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
        className="text-[#78012c] absolute px-24 inset-0 flex flex-col justify-center items-stretch"
        style={{
          opacity: status >= 0 && status < 1 ? 1 : 0,
        }}
      >
        <div className="flex-1"></div>
        <div className="flex-3 grid grid-cols-4 items-center">
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
                opacity:
                  slide.teamAndPlayers[playerKey].result.ranking !== '1'
                    ? 1
                    : 0.5,
              }}
            >
              <div
                className="absolute inset-0 -z-10 border-l-1 border-r-1 border-[#d41737C0]"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${slide.teamAndPlayers[playerKey].player.color})`,
                  opacity: 0.5,
                }}
              ></div>
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background: `url(${
                    slide.teamAndPlayers[playerKey].player.largeLogoUrl +
                    '?w=800&h=800&auto=format'
                  })`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                  opacity: 0.05,
                }}
              ></div>
              <div
                className={cns('absolute bottom-0 left-0 right-0', {
                  'mi-teams-team-out': status >= 0 && subslide > 0,
                })}
              >
                <h3
                  className="text-[2em] font-semibold text-center font-serif"
                  style={{
                    color: slide.teamAndPlayers[playerKey].player.color,
                  }}
                >
                  {slide.teamAndPlayers[playerKey].player.primaryName}
                </h3>
                <h3 className="text-[1.5em] leading-[1em] font-semibold text-center flex justify-between px-[1em] mb-6">
                  <div
                    className="px-4 py-1"
                    style={{
                      background:
                        rankingColors[
                          (parseInt(
                            slide.teamAndPlayers[playerKey].result.ranking
                          ) ?? 1) - 1
                        ].bgColor,
                      color:
                        rankingColors[
                          (parseInt(
                            slide.teamAndPlayers[playerKey].result.ranking
                          ) ?? 1) - 1
                        ].color,
                    }}
                  >
                    {renderRanking(
                      slide.teamAndPlayers[playerKey].result.ranking
                    )}
                  </div>
                  <span>
                    {renderPoint(slide.teamAndPlayers[playerKey].result.point)}
                  </span>
                </h3>
                <img
                  src={slide.teamAndPlayers[playerKey].player.propicUrl!}
                  className="w-full"
                  alt=""
                />
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
        <div className="flex-3 flex flex-col items-stretch gap-y-[0.25em]">
          <div
            className={cns('flex gap-x-[1em] pl-[1em] mb-[.5em] items-end', {
              'mi-teams-in': status === 0,
              'mi-teams-out': status > 0,
            })}
          >
            <div className="flex-5 space-x-[1.5em] text-[1.1em]">
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
            <div className="flex-1 text-right text-[.9em] font-semibold pr-8">
              放銃次數
            </div>
          </div>
          {slide.teamAndPlayers.map(({ player, result }, index) => (
            <div
              key={index}
              className={cns(
                'text-[#78012c] relative overflow-hidden flex-1 border-1 border-[#78012c] rounded-[0.5em]',
                {
                  'mi-teams-in': status === 0,
                  'mi-teams-out': status > 0,
                }
              )}
              style={{
                animationDelay: status === 0 ? index * 0.25 + 's' : '0s',
                background: rankingColors[index].bgColor,
                color: rankingColors[index].color,
              }}
            >
              <div className="absolute inset-0 -z-10"></div>
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background: `url(${
                    player.largeLogoUrl + '?w=800&h=800&auto=format'
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
                <div className="text-left flex-5">
                  <h3 className="text-[1.5em] font-semibold">
                    {player.primaryName}
                  </h3>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[1.5em] leading-[1em]">
                    {renderScore(result.score)}
                  </p>
                  <p>{renderPoint(result.point)}</p>
                </div>
                <div className="flex-1 text-right">
                  <span className="text-[1.5em]">
                    {renderScore(result.riichiCount)}
                  </span>
                  回
                </div>
                <div className="flex-1 text-right">
                  <span className="text-[1.5em]">
                    {renderScore(result.ronCount)}
                  </span>
                  回
                </div>
                <div className="flex-1 text-right pr-8">
                  <span className="text-[1.5em]">
                    {renderScore(result.chuckCount)}
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
                  className="aspect-18/25 w-full"
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
        className="text-[#78012c] absolute py-16 px-24 inset-0 flex flex-col justify-center items-stretch"
        style={{
          opacity: status >= 0 && status < 1 ? 1 : 0,
        }}
      >
        <div className="flex-1"></div>
        <div className="flex-3 flex items-stretch gap-x-[1em]">
          <div
            className={cns('flex-3 bg-white/25 p-4', {
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
                key={index}
                className={cns(
                  'relative overflow-hidden flex-1 px-[.5em] flex flex-col justify-center border-t-1 border-b-1 border-[#78012c]',
                  {
                    'mi-chart-player-in': status === 0,
                    'mi-chart-player-out': status > 0,
                  }
                )}
                style={{
                  color: rankingColors[index].color,
                  background: rankingColors[index].bgColor,
                  animationDelay: status === 0 ? index * 0.25 + 's' : '0s',
                }}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-[1.25em] leading-[1em]">
                      {slide.teamAndPlayers[index].player.primaryName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[1.25em] leading-[1em]">
                      {slide.teamAndPlayers[index].result.score}
                    </p>
                    <p className="text-[.75em]">
                      {renderPoint(slide.teamAndPlayers[index].result.point)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  } else if (slide.type === 'grand-ranking') {
    return (
      <div
        className={`absolute top-[20vh] left-[5vw] right-[5vw] flex flex-col ${styles['twr-players-ranking']}`}
        data-active={status === 0}
      >
        <div className="grid grid-cols-2 gap-x-8 text-[0.5em] mt-8">
          <div className="space-y-4">
            {slide.players.slice(0, 8).map((player, index) => (
              <div
                key={player.player.id}
                className="twr-players-ranking-item"
                style={
                  {
                    '--transition-in-delay': `${((index + 1) * 0.08).toFixed(2)}s`,
                    '--transition-out-delay': `0s`,
                  } as CSSProperties
                }
              >
                <PlayerCardInRanking {...player} ranking={index + 1} />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {slide.players.slice(8, 16).map((player, index) => (
              <div
                key={player.player.id}
                className="twr-players-ranking-item"
                style={
                  {
                    '--transition-in-delay': `${((index + 4) * 0.08).toFixed(2)}s`,
                    '--transition-out-delay': `0s`,
                  } as CSSProperties
                }
              >
                <PlayerCardInRanking {...player} ranking={index + 9} />
              </div>
            ))}
          </div>
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
}: Props) => {
  const { rtMatch, rtMatchRounds } = useRealtimeMatch(matchId)
  const { data: match } = useDbMatchV2(rtMatch?.databaseId)

  const { data } = useQuery({
    queryKey: ['tournament', match?.data.tournamentId],
    queryFn: () => apiGetTournamentById(match?.data.tournamentId as string),
    enabled: !!match?.data.tournamentId,
    staleTime: 5 * 60 * 1000,
  })

  const slides = useMemo<Slide[]>(() => {
    if (!rtMatch || !rtMatchRounds) {
      return [{ type: 'empty', _id: 'empty', subslide: 0 }]
    }

    const exportedMatch = convertMatchToExportedMatch(
      Object.values(rtMatchRounds)
    )

    const resultSlides: Slide[] = [
      { type: 'empty', _id: 'empty', subslide: 0 },
      {
        type: 'teams',
        _id: 'teams',
        teamAndPlayers: {
          playerEast: {
            player: rtMatch.players[0],
            result: {
              point: exportedMatch.result.playerEast.point,
              ranking: exportedMatch.result.playerEast.ranking,
            },
          },
          playerSouth: {
            player: rtMatch.players[1],
            result: {
              point: exportedMatch.result.playerSouth.point,
              ranking: exportedMatch.result.playerSouth.ranking,
            },
          },
          playerWest: {
            player: rtMatch.players[2],
            result: {
              point: exportedMatch.result.playerWest.point,
              ranking: exportedMatch.result.playerWest.ranking,
            },
          },
          playerNorth: {
            player: rtMatch.players[3],
            result: {
              point: exportedMatch.result.playerNorth.point,
              ranking: exportedMatch.result.playerNorth.ranking,
            },
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
        player: rtMatch.players[0],
        result: playersStat.playerEast,
      },
      {
        player: rtMatch.players[1],
        result: playersStat.playerSouth,
      },
      {
        player: rtMatch.players[2],
        result: playersStat.playerWest,
      },
      {
        player: rtMatch.players[3],
        result: playersStat.playerNorth,
      },
    ].sort((a, b) => b.result.score - a.result.score)

    resultSlides.push({
      type: 'players',
      _id: 'players',
      teamAndPlayers: sortedTeamPlayers,
      roundCount:
        exportedMatch.rounds?.filter((round) => round.type !== 'hotfix')
          .length ?? 0,
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
          name: rtMatch.players[0].primaryName!,
          color:
            rankingColors[(parseInt(playersStat.playerEast.ranking) ?? 1) - 1]
              .strokeColor,
          strokeColor:
            rankingColors[(parseInt(playersStat.playerEast.ranking) ?? 1) - 1]
              .color,
        },
        playerSouth: {
          name: rtMatch.players[1].primaryName!,
          color:
            rankingColors[(parseInt(playersStat.playerSouth.ranking) ?? 1) - 1]
              .strokeColor,
          strokeColor:
            rankingColors[(parseInt(playersStat.playerSouth.ranking) ?? 1) - 1]
              .color,
        },
        playerWest: {
          name: rtMatch.players[2].primaryName!,
          color:
            rankingColors[(parseInt(playersStat.playerWest.ranking) ?? 1) - 1]
              .strokeColor,
          strokeColor:
            rankingColors[(parseInt(playersStat.playerWest.ranking) ?? 1) - 1]
              .color,
        },
        playerNorth: {
          name: rtMatch.players[3].primaryName!,
          color:
            rankingColors[(parseInt(playersStat.playerNorth.ranking) ?? 1) - 1]
              .strokeColor,
          strokeColor:
            rankingColors[(parseInt(playersStat.playerNorth.ranking) ?? 1) - 1]
              .color,
        },
      },
      teamAndPlayers: sortedTeamPlayers,
      subslide: 1,
    })

    const playerKeys = [
      'playerEast',
      'playerSouth',
      'playerWest',
      'playerNorth',
    ] as const

    if (data && match) {
      const updatedPlayers = data.players.map((player) => ({
        player,
        point: player.statistics?.point ?? 0.0,
        active: false,
      }))

      for (let i = 0; i < 4; i++) {
        const player = updatedPlayers.find(
          (item) => item.player.id === match.data.players[i].id
        )
        if (player) {
          player.point += playersStat[playerKeys[i]].point
          player.active = true
        }
      }

      resultSlides.push({
        type: 'grand-ranking',
        _id: 'grand-ranking',
        players: updatedPlayers.toSorted(
          (a, b) => (b.point ?? 0) - (a.point ?? 0)
        ),
        subslide: 1,
      })
    }

    return resultSlides
  }, [data, match, rtMatch, rtMatchRounds])

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
    handleSlideForward()
  }, [handleSlideForward])

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

  if (!rtMatch || !rtMatchRounds || !match) {
    return <></>
  }

  return (
    <div
      className={`${styles['match-introduction']} absolute inset-0 text-[#ec276e] text-[36px]`}
      style={{
        background:
          'linear-gradient(to bottom, rgb(255, 217, 227), rgb(255, 192, 203)',
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
      <div className="absolute py-16 px-24 inset-0">
        <div className="flex items-start gap-x-[0.25em] mi-title-in">
          <div className="flex-1">
            <div className="flex justify-start">
              <div className="font-bold text-[1.5em] leading-[100%]">
                {/* {match.metadata.startAt.substring(0, 10)} */}
              </div>
            </div>
            <div className="flex gap-x-10">
              <div className="font-bold text-[2.5em]">對局結果</div>
              <div className="font-bold text-[2.5em]">Result</div>
            </div>
          </div>
          <div>
            <h1 className="text-[1.25em] font-semibold font-serif">
              {match.data.name.official.primary}
            </h1>
          </div>
        </div>
        {/* <h1 className="text-[2.2em] leading-[1.2em] font-semibold mi-subbtitle-in">
          {match.name}
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
