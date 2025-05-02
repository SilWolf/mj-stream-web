import { renderPercentage, renderPoint } from '@/utils/string.util'
import { useCallback, useEffect, useMemo, useState } from 'react'
import cns from 'classnames'
import useDbMatchWithStatistics from '@/hooks/useDbMatchWithStatistics'
import { Match, Player, Team } from '@/models'

import styles from './index.module.css'
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
      type: 'players'
      match: Match
      teamAndPlayers: { team: Team; player: Player }[]
      subslide: 1
    }
  | {
      _id: string
      type: 'player'
      team: Team
      focusPlayer: Player
      subslide: 1
    }

const MatchTeamPlayerFullBodyDiv = ({
  player,
  fadeIn,
  fadeOut,
  delay,
}: {
  player: Player
  fadeIn: boolean
  fadeOut: boolean
  delay: number
}) => {
  return (
    <div
      key={player.name}
      className={cns(
        'absolute -inset-[1em] h-full rounded-[1em] overflow-visible',
        {
          'mi-team-player-in': fadeIn,
          'mi-team-player-out': fadeOut,
        }
      )}
      style={{
        animationDelay: delay + 's',
      }}
    >
      <img
        className="absolute inset-0 z-10 block mx-auto w-full"
        src={player.fullBodyImage + '?h=1200&auto=format&fit=clip'}
        alt={player.name!}
      />
      {/* <div
        className="absolute z-20 bottom-0 left-0 right-0 text-center py-[0.25em]"
        style={{
          background: 'linear-gradient(to top, #00000090 80%, transparent',
        }}
      >
        <div>
          <p className="text-[1.5em]">{player.name}</p>
        </div>
      </div> */}
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
  if (slide.type === 'players') {
    return (
      <div
        className="absolute px-24 inset-0 flex flex-col justify-center items-stretch"
        style={{
          opacity: status >= 0 && status < 1 ? 1 : 0,
        }}
      >
        <div
          className={cns('flex-1 flex flex-col justify-center pl-16', {
            'mi-title-in': status === 0,
            'mi-title-out': status > 0,
          })}
        >
          <div className="flex justify-start">
            <div className="font-bold text-[1.5em] leading-[100%]">
              {slide.match.startAt.substring(0, 10)}
            </div>
          </div>
          <div className="flex gap-x-10">
            <div className="font-bold text-[2.5em]">今日出戰選手</div>
            <div className="font-bold text-[2.5em]">Today's Players</div>
          </div>
        </div>

        <div className="flex-2 grid grid-cols-4 items-center">
          {slide.teamAndPlayers.map(({ team, player }, index) => (
            <div
              key={player._id}
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
                className={cns('absolute bottom-0 left-0 right-0', {
                  'mi-teams-team-out': status >= 0 && subslide > 0,
                })}
              >
                <h3
                  className="text-[2em] font-semibold text-center mb-8"
                  style={{
                    color: team.color,
                  }}
                >
                  {player.name}
                </h3>
                <img
                  src={
                    player.portraitImage +
                    '?w=720&h=1000&auto=format&fit=crop&crop=top'
                  }
                  className="aspect-[18/25] w-full"
                  alt=""
                />
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
                  src={player.portraitImage + '?w=720&h=1000&auto=format'}
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
  } else if (slide.type === 'player') {
    return (
      <div
        className="absolute py-16 px-24 inset-0 flex flex-col justify-center items-stretch"
        style={{
          opacity: status >= 0 && status < 1 ? 1 : 0,
        }}
      >
        <div
          className={cns('flex-1 text-right mb-[.5em]', {
            'mi-team-team-in': status === 0,
            'mi-team-team-out': status > 0,
          })}
        >
          <div className="flex-1 flex gap-x-[1.5em] items-center justify-end">
            <div className="text-left space-y-[.5em]">
              <div className="flex justify-start gap-x-[1em]"></div>
              <div className="flex justify-start gap-x-[1em]"></div>
            </div>
          </div>

          <h3 className="inline-block font-semibold text-right text-[1.5em]"></h3>
        </div>
        <div className="flex-8 relative">
          <div
            className="absolute inset-0 grid grid-cols-4 items-stretch gap-16"
            style={{
              opacity: status >= 0 && status < 1 ? 1 : 0,
            }}
          >
            <div className="relative col-span-1">
              <MatchTeamPlayerFullBodyDiv
                player={slide.focusPlayer}
                fadeIn={status === 0}
                fadeOut={status > 0}
                delay={0}
              />
            </div>
            <div className="col-span-3 text-[#78012c] -mt-12">
              <div
                className={cns({
                  'mi-team-activePlayerStat-in': status === 0,
                  'mi-team-activePlayerStat-out': status > 0,
                })}
              >
                <div
                  className="text-[5em] font-bold mb-2"
                  style={{
                    color: slide.team.color,
                  }}
                >
                  {slide.focusPlayer.name}
                </div>
                <div className="flex justify-between mb-[1em] text-[#78012c]">
                  <p className="text-[2em] gap-x-8 flex items-center">
                    <span>總分</span>
                    <span className="font-numeric">
                      {renderPoint(slide.focusPlayer.statistics?.point)}
                    </span>
                    <span className="ml-4 font-numeric text-[.75em] min-w-[2.5em] text-right text-[#ec276e]">
                      ( 第 {slide.focusPlayer.statistics?.pointRanking ?? '10'}{' '}
                      名 )
                    </span>
                  </p>
                  <p className="text-[2em]">
                    半莊數{' '}
                    <span className="font-numeric">
                      {slide.focusPlayer.statistics?.matchCount ?? '0'} / 16
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-x-[2em] gap-y-[.35em] text-[1.5em]">
                  <div className="flex justify-between items-center">
                    <p className="text-[.9em]">四位迴避率</p>
                    <p className="flex items-center text-[.8em]">
                      <span className="font-numeric">
                        {renderPercentage(
                          slide.focusPlayer.statistics?.nonFourthP
                        )}
                      </span>
                      <span className="font-numeric ml-6 text-[.75em] min-w-[2.5em] text-right text-[#ec276e]">
                        ({' '}
                        {slide.focusPlayer.statistics?.nonFourthPRanking ?? '-'}{' '}
                        位 )
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[.9em]">連對率</p>
                    <p className="flex items-center text-[.8em]">
                      <span className="font-numeric">
                        {' '}
                        {renderPercentage(
                          slide.focusPlayer.statistics?.firstAndSecondP
                        )}
                      </span>
                      <span className="font-numeric ml-6 text-[.75em] min-w-[2.5em] text-right text-[#ec276e]">
                        ({' '}
                        {slide.focusPlayer.statistics?.firstAndSecondPRanking ??
                          '-'}{' '}
                        位 )
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[.9em]">立直率</p>
                    <p className="flex items-center text-[.8em]">
                      <span className="font-numeric">
                        {' '}
                        {renderPercentage(
                          slide.focusPlayer.statistics?.riichiP
                        )}
                      </span>
                      <span className="font-numeric ml-6 text-[.75em] min-w-[2.5em] text-right text-[#ec276e]">
                        ( {slide.focusPlayer.statistics?.riichiPRanking ?? '-'}{' '}
                        位 )
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[.9em]">和了率</p>
                    <p className="flex items-center text-[.8em]">
                      <span className="font-numeric">
                        {renderPercentage(slide.focusPlayer.statistics?.ronP)}
                      </span>
                      <span className="font-numeric ml-6 text-[.75em] min-w-[2.5em] text-right text-[#ec276e]">
                        ( {slide.focusPlayer.statistics?.ronPRanking ?? '-'} 位
                        )
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[.9em]">銃和率</p>
                    <p className="flex items-center text-[.8em]">
                      <span className="font-numeric">
                        {' '}
                        {renderPercentage(slide.focusPlayer.statistics?.chuckP)}
                      </span>
                      <span className="font-numeric ml-6 text-[.75em] min-w-[2.5em] text-right text-[#ec276e]">
                        ( {slide.focusPlayer.statistics?.chuckPRanking ?? '-'}{' '}
                        位 )
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[.9em]">副露率</p>
                    <p className="flex items-center text-[.8em]">
                      <span className="font-numeric">
                        {' '}
                        {renderPercentage(
                          slide.focusPlayer.statistics?.revealP
                        )}
                      </span>
                      <span className="font-numeric ml-6 text-[.75em] min-w-[2.5em] text-right text-[#ec276e]">
                        ( {slide.focusPlayer.statistics?.revealPRanking ?? '-'}
                        {''} 位 )
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-[2em] text-[1.5em] mt-[.4em]">
                  <div className="flex justify-between items-start">
                    <p className="text-[.75em]">和了平均打點</p>
                    <div className="text-right text-[.8em]">
                      <span className="font-numeric">
                        {renderPercentage(
                          slide.focusPlayer.statistics?.ronPureScoreAvg
                        )}
                      </span>
                      <span className="font-numeric ml-6 text-[.75em] min-w-[2.5em] text-[#ec276e] -mt-4">
                        ({' '}
                        {slide.focusPlayer.statistics?.ronPureScoreAvgRanking ??
                          '-'}{' '}
                        位 )
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <p className="text-[.75em]">銃和平均打點</p>
                    <div className="text-right text-[.8em]">
                      <span className="font-numeric">
                        {renderPercentage(
                          slide.focusPlayer.statistics?.chuckPureScoreAvg
                        )}
                      </span>
                      <span className="font-numeric ml-6 text-[.75em] min-w-[2.5em] text-[#ec276e] -mt-4">
                        ({' '}
                        {slide.focusPlayer.statistics
                          ?.chuckPureScoreAvgRanking ?? '-'}{' '}
                        位 )
                      </span>
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
}: Props) => {
  const { rtMatch } = useRealtimeMatch(matchId)
  const { data: match } = useDbMatchWithStatistics(rtMatch?.databaseId)

  const slides = useMemo<Slide[]>(() => {
    if (!match) {
      return [{ type: 'empty', _id: 'empty', subslide: 0 }]
    }

    return [
      {
        type: 'players',
        _id: 'players',
        match,
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
        _id: 'player_playerEast',
        type: 'player',
        team: match.playerEastTeam,
        focusPlayer: match.playerEast,
        subslide: 1,
      },
      {
        _id: 'player_playerSouth',
        type: 'player',
        team: match.playerSouthTeam,
        focusPlayer: match.playerSouth,
        subslide: 1,
      },
      {
        _id: 'player_playerWest',
        type: 'player',
        team: match.playerWestTeam,
        focusPlayer: match.playerWest,
        subslide: 1,
      },
      {
        _id: 'player_playerNorth',
        type: 'player',
        team: match.playerNorthTeam,
        focusPlayer: match.playerNorth,
        subslide: 1,
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
      setSlideIndex(0)
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

  if (!match) {
    return <></>
  }

  return (
    <div
      className={`absolute inset-0 text-[#ec276e] text-[36px] -z-50 overflow-hidden ${styles['match-introduction']}`}
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
      <div className="absolute pt-6 pb-16 pl-16 pr-24 inset-0 flex items-start justify-end">
        {/* <div className="flex gap-x-[1.25em] mi-title-in items-center">
          <div>
            <img
              src={match.tournament.logoUrl + '?w=280&h=280&auto=format'}
              alt={match.tournament.name}
              style={{ width: '5em', height: '5em', marginTop: '0.15em' }}
            />
          </div>
          <div>
            <h3 className="text-[2.5em]">{match.tournament.name}</h3>
          </div>
        </div> */}
        {/* <img src="/images/logo-sakura-long.png" className="h-[4em]" alt="" /> */}
        {/* <h1 className="mt-[0.8em] text-[1em] leading-[1.2em] font-semibold">
          {match.name}
        </h1> */}
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
