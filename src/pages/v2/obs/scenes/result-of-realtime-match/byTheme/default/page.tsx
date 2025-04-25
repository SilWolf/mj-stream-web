import {
  getLightColorOfColor,
  renderPercentage,
  renderPoint,
  renderRanking,
} from '@/utils/string.util'
import { useCallback, useEffect, useMemo, useState } from 'react'
import cns from 'classnames'
import useDbMatchWithStatistics from '@/hooks/useDbMatchWithStatistics'
import { Player, Team } from '@/models'
import useRealtimeMatch from '@/hooks/useRealtimeMatch'

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
      teamAndPlayers: { team: Team; player: Player }[]
      subslide: 1 | 2
    }
  | {
      _id: string
      type: 'team'
      team: Team
      players: Player[]
      focusPlayer: Player
      subslide: 1 | 2
    }

const MatchTeamPlayerDiv = ({
  team,
  player,
  fadeIn,
  fadeOut,
  delay,
}: {
  team: Team
  player: Player
  fadeIn: boolean
  fadeOut: boolean
  delay: number
}) => {
  const lightenedColor = getLightColorOfColor(team.color)

  return (
    <div
      key={player.name}
      className={cns('relative aspect-18/25 rounded-[1em] overflow-hidden', {
        'mi-team-player-in': fadeIn,
        'mi-team-player-out': fadeOut,
      })}
      style={{
        background: `linear-gradient(180deg, ${team.color}, ${lightenedColor})`,
        animationDelay: delay + 's',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `url(${
            team.squareLogoImage + '?w=500&h=500&auto=format'
          })`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.2,
        }}
      ></div>
      <img
        className="relative z-10 block mx-auto w-full"
        src={
          player.portraitImage + '?h=500&w=360&auto=format&fit=crop&crop=top'
        }
        alt={player.name!}
      />
      <div
        className="absolute z-20 bottom-0 left-0 right-0 text-center py-[0.25em]"
        style={{
          background: 'linear-gradient(to top, #00000090 80%, transparent',
        }}
      >
        <div>
          <p className="text-[1.5em] leading-[1em] font-semibold">
            {player.nickname}
          </p>
          <p className="text-[0.8em]">{player.name}</p>
        </div>
      </div>
    </div>
  )
}

const MatchIntroductionSlide = ({
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
        <div className="flex-2 grid grid-cols-4 items-center">
          {slide.teamAndPlayers.map(({ team, player }, index) => (
            <div
              key={team._id}
              className={cns('relative h-full overflow-hidden', {
                'mi-teams-in': status === 0,
                'mi-teams-out': status > 0,
              })}
              style={{
                animationDelay: status === 0 ? index * 0.25 + 's' : '0s',
              }}
            >
              <div
                key={team._id}
                className="absolute inset-0 -z-10"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${team.color})`,
                  opacity: 0.5,
                }}
              ></div>
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background: `url(${
                    team.squareLogoImage + '?w=800&h=800&auto=format'
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
                  src={team.squareLogoImage + '?w=800&h=800&auto=format'}
                  className="aspect-square w-full"
                  alt=""
                />
                <h3 className="text-[1.5em] font-semibold text-center">
                  {team.name}
                </h3>
                <h3 className="text-[1em] font-semibold text-center">
                  {team.secondaryName}
                </h3>
              </div>
              <div
                className={cns('absolute inset-0 opacity-0', {
                  'mi-teams-player-in': status >= 0 && subslide >= 1,
                  'mi-teams-player-out': status > 0,
                })}
                style={{
                  animationDelay: status === 0 ? index * 0.25 + 's' : '0s',
                }}
              >
                <img
                  src={player.portraitImage + '?w=360&h=500&auto=format'}
                  className="aspect-18/25 w-full"
                  alt=""
                />
                <div className="font-semibold text-center">
                  <p className="text-[1em]">{player.nickname}</p>
                  <p className="text-[.8em]">{player.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  } else if (slide.type === 'team') {
    return (
      <div
        className="absolute py-16 px-24 inset-0 flex flex-col justify-center items-stretch"
        style={{
          opacity: status >= 0 && status < 1 ? 1 : 0,
        }}
      >
        <div
          className={cns('absolute inset-0 -z-10', {
            'mi-team-colorBackground-in': status === 0,
            'mi-team-colorBackground-out': status > 0,
          })}
          style={{
            background: `linear-gradient(to bottom, transparent 60%, ${slide.team.color})`,
            opacity: 0.5,
          }}
        ></div>
        <div
          className={cns('absolute inset-0 -z-10', {
            'mi-team-logoBackground-in': status === 0,
            'mi-team-logoBackground-out': status > 0,
          })}
          style={{
            background: `url(${
              slide.team.squareLogoImage + '?w=800&h=800&auto=format'
            })`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            opacity: 0.125,
          }}
        ></div>

        <div
          className={cns('text-right mb-[.5em]', {
            'mi-team-team-in': status === 0,
            'mi-team-team-out': status > 0,
          })}
        >
          <div className="flex-1 flex gap-x-[1.5em] items-center justify-end">
            <div className="text-left space-y-[.5em]">
              <div className="flex justify-start gap-x-[1em]">
                <p>隊伍積分</p>
                <p>
                  <span className="font-numeric">
                    {renderPoint(slide.team.statistics?.point)}
                  </span>
                </p>
              </div>
              <div className="flex justify-start gap-x-[1em]">
                <p>隊伍排名</p>
                <p>
                  <span className="font-numeric">
                    {renderRanking(slide.team.statistics?.ranking)}
                  </span>
                </p>
              </div>
            </div>
            <img
              src={slide.team.squareLogoImage + '?w=512&h=512&auto=format'}
              alt={slide.team.name!}
              className="aspect-square"
              style={{
                width: 256,
                height: 256,
              }}
            />
          </div>

          <h3 className="inline-block font-semibold text-right text-[1.5em]">
            {slide.team.name} {slide.team.secondaryName}
          </h3>
        </div>
        <div className="flex-2 relative">
          <div
            className="absolute inset-0 grid grid-cols-4 items-center gap-16"
            style={{
              opacity: status === 0 && subslide >= 0 && subslide < 1 ? 1 : 0,
            }}
          >
            {slide.players.map((player, index) => (
              <MatchTeamPlayerDiv
                key={player._id}
                team={slide.team}
                player={player}
                fadeIn={status === 0 && subslide <= 0}
                fadeOut={status === 0 && subslide > 0}
                delay={(subslide <= 0 ? 0 : 0) + index * 0.25}
              />
            ))}
          </div>
          <div
            className="absolute inset-0 grid grid-cols-4 items-center gap-16"
            style={{
              opacity:
                status >= 0 && status < 1 && subslide >= 1 && subslide < 2
                  ? 1
                  : 0,
            }}
          >
            <MatchTeamPlayerDiv
              team={slide.team}
              player={slide.focusPlayer}
              fadeIn={status === 0 && subslide === 1}
              fadeOut={status > 0}
              delay={0}
            />
            <div className="col-span-3">
              <div
                className={cns({
                  'mi-team-activePlayerStat-in': status === 0 && subslide === 1,
                  'mi-team-activePlayerStat-out': status > 0,
                })}
              >
                <div className="flex justify-between mb-[1em]">
                  <p className="text-[2em] flex items-center">
                    <span>個人總分</span>
                    <span className="font-numeric">
                      {renderPoint(slide.focusPlayer.statistics?.point)}
                    </span>
                    <span className="ml-4 font-numeric text-[.75em] min-w-[2.5em] text-right text-cyan-400">
                      {slide.focusPlayer.statistics?.pointRanking ?? '-'}名
                    </span>
                  </p>
                  <p className="text-[2em]">
                    半莊數{' '}
                    <span className="font-numeric">
                      {slide.focusPlayer.statistics?.matchCount ?? '-'}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-x-[2em] text-[1.5em]">
                  <div className="flex justify-between">
                    <p className="text-[.9em]">四位迴避率</p>
                    <p className="flex items-center">
                      <span className="font-numeric">
                        {renderPercentage(
                          slide.focusPlayer.statistics?.nonFourthP
                        )}
                      </span>
                      <span className="font-numeric ml-2 text-[.75em] min-w-[2.5em] text-right text-cyan-400">
                        {' '}
                        {slide.focusPlayer.statistics?.nonFourthPRanking ?? '-'}
                        名
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[.9em]">連對率</p>
                    <p className="flex items-center">
                      <span className="font-numeric">
                        {renderPercentage(
                          slide.focusPlayer.statistics?.firstAndSecondP
                        )}
                      </span>
                      <span className="font-numeric ml-2 text-[.75em] min-w-[2.5em] text-right text-cyan-400">
                        {' '}
                        {slide.focusPlayer.statistics?.firstAndSecondPRanking ??
                          '-'}
                        名
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[.9em]">立直率</p>
                    <p className="flex items-center">
                      <span className="font-numeric">
                        {renderPercentage(
                          slide.focusPlayer.statistics?.riichiP
                        )}
                      </span>
                      <span className="font-numeric ml-2 text-[.75em] min-w-[2.5em] text-right text-cyan-400">
                        {' '}
                        {slide.focusPlayer.statistics?.riichiPRanking ?? '-'}名
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[.9em]">和了率</p>
                    <p className="flex items-center">
                      <span className="font-numeric">
                        {renderPercentage(slide.focusPlayer.statistics?.ronP)}
                      </span>
                      <span className="font-numeric ml-2 text-[.75em] min-w-[2.5em] text-right text-cyan-400">
                        {' '}
                        {slide.focusPlayer.statistics?.ronPRanking ?? '-'}名
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[.9em]">銃和率</p>
                    <p className="flex items-center">
                      <span className="font-numeric">
                        {renderPercentage(slide.focusPlayer.statistics?.chuckP)}
                      </span>
                      <span className="font-numeric ml-2 text-[.75em] min-w-[2.5em] text-right text-cyan-400">
                        {' '}
                        {slide.focusPlayer.statistics?.chuckPRanking ?? '-'}名
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[.9em]">副露率</p>
                    <p className="flex items-center">
                      <span className="font-numeric">
                        {renderPercentage(
                          slide.focusPlayer.statistics?.revealP
                        )}
                      </span>
                      <span className="font-numeric ml-2 text-[.75em] min-w-[2.5em] text-right text-cyan-400">
                        {' '}
                        {slide.focusPlayer.statistics?.revealPRanking ?? '-'}名
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-[2em] text-[1.5em] mt-[.8em]">
                  <div className="flex justify-between items-start">
                    <p className="text-[.9em]">和了平均打點</p>
                    <div className="text-right">
                      <p className="font-numeric">
                        {renderPercentage(
                          slide.focusPlayer.statistics?.ronPureScoreAvg
                        )}
                      </p>
                      <p className="font-numeric text-[.75em] min-w-[2.5em] text-cyan-400 -mt-4">
                        {slide.focusPlayer.statistics?.ronPureScoreAvgRanking ??
                          '-'}
                        名
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <p className="text-[.9em]">銃和平均打點</p>
                    <div className="text-right">
                      <p className="font-numeric">
                        {renderPercentage(
                          slide.focusPlayer.statistics?.chuckPureScoreAvg
                        )}
                      </p>
                      <p className="font-numeric text-[.75em] min-w-[2.5em] text-cyan-400 -mt-4">
                        {slide.focusPlayer.statistics
                          ?.chuckPureScoreAvgRanking ?? '-'}
                        名
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <></>
}

const MatchIntroductionPage = ({
  params: { matchId },
  forwardFlag,
  resetFlag,
  disableClick,
}: Props) => {
  const { rtMatch } = useRealtimeMatch(matchId)
  const { data: match } = useDbMatchWithStatistics(rtMatch?.databaseId)

  const slides = useMemo<Slide[]>(() => {
    if (!match) {
      return [{ type: 'empty', _id: 'empty', subslide: 0 }]
    }

    return [
      { type: 'empty', _id: 'empty', subslide: 0 },
      {
        type: 'teams',
        _id: 'teams',
        teamAndPlayers: [
          {
            team: match.playerEastTeam,
            player: match.playerEast,
          },
          {
            team: match.playerSouthTeam,
            player: match.playerSouth,
          },
          {
            team: match.playerWestTeam,
            player: match.playerWest,
          },
          {
            team: match.playerNorthTeam,
            player: match.playerNorth,
          },
        ],
        subslide: 1,
      },
      {
        _id: 'team_playerEast',
        type: 'team',
        team: match.playerEastTeam,
        players: match.playerEastTeam.players,
        focusPlayer: match.playerEast,
        subslide: 2,
      },
      {
        _id: 'team_playerSouth',
        type: 'team',
        team: match.playerSouthTeam,
        players: match.playerSouthTeam.players,
        focusPlayer: match.playerSouth,
        subslide: 2,
      },
      {
        _id: 'team_playerWest',
        type: 'team',
        team: match.playerWestTeam,
        players: match.playerWestTeam.players,
        focusPlayer: match.playerWest,
        subslide: 2,
      },
      {
        _id: 'team_playerNorth',
        type: 'team',
        team: match.playerNorthTeam,
        players: match.playerNorthTeam.players,
        focusPlayer: match.playerNorth,
        subslide: 2,
      },
    ]
  }, [match])

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

  if (!match) {
    return <></>
  }

  return (
    <div
      className="match-introduction absolute inset-0 text-white text-[36px] -z-50 overflow-hidden"
      style={{
        background:
          'linear-gradient(to bottom, rgb(30, 34, 59), rgb(16, 18, 33))',
      }}
      onClick={handleClickScreen}
    >
      <div className="absolute py-16 px-24 inset-0">
        <div className="flex gap-x-[0.25em] mi-title-in">
          <div>
            <img
              src={match.tournament.logoUrl + '?w=280&h=280&auto=format'}
              alt={match.tournament.name}
              style={{ width: '3.5em', height: '3.5em', marginTop: '0.15em' }}
            />
          </div>
          <div>
            <h3 className="text-[1.25em] leading-[1em]">
              {match.tournament.name}
            </h3>
            <h1 className="text-[2em] leading-[1.2em] font-semibold">
              {match.name}
            </h1>
          </div>
        </div>
        {/* <h1 className="text-[2.2em] leading-[1.2em] font-semibold mi-subbtitle-in">
          {match.name}
        </h1> */}
      </div>
      {slides.map((slide, index) => (
        <MatchIntroductionSlide
          key={slide._id}
          slide={slide}
          status={slideIndex - index}
          subslide={subSlideIndex}
        />
      ))}
    </div>
  )
}

export default MatchIntroductionPage
