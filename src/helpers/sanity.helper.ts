import { Match, Player, RawMatch, RealtimePlayer, Team } from '@/models'
import { mergeObject } from '@/utils/object.util'
import { createClient } from '@sanity/client'

const PLAYER_PROJECTION = `_id, name, nickname, designation, "portraitImage": portraitImage.asset->url, introduction`
const PLAYER_META_FIELDS = [
  'name',
  'nickname',
  '"portraitImage": portraitImage.asset->url',
  'designation',
  'introduction',
]

const TEAM_PROJECTION = `{_id, "slug": slug.current, name, secondaryName, thirdName, "squareLogoImage": squareLogoImage.asset->url, "color": color.hex, introduction}`
const TEAM_META_FIELDS = [
  '"slug": slug.current',
  'name',
  'secondaryName',
  'thirdName',
  '"squareLogoImage": squareLogoImage.asset->url',
  '"color": color.hex',
  'introduction',
]

export const client = createClient({
  projectId: '0a9a4r26',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
  token: import.meta.env.VITE_DATABASE_API_KEY,
})

export type DB_Match = {
  _id: string
  name: string
  playerEast?: DB_TeamPlayer
  playerSouth?: DB_TeamPlayer
  playerWest?: DB_TeamPlayer
  playerNorth?: DB_TeamPlayer
  playerEastTeam?: DB_Team
  playerSouthTeam?: DB_Team
  playerWestTeam?: DB_Team
  playerNorthTeam?: DB_Team
  tournament: DB_MatchTournament
  startAt: string
  result: {
    playerEast?: DB_MatchResult
    playerSouth?: DB_MatchResult
    playerWest?: DB_MatchResult
    playerNorth?: DB_MatchResult
  }
  rounds: DB_MatchRound[]
}

export type DB_TeamPlayer = {
  team: DB_Team
  player: DB_Player
  overridedDesignation: string | null
  overridedName: string | null
  overridedColor: string | null
  overridedPortraitImage: string | null
  overridedNickname: string | null
  isHideNickname: boolean
}

export type DB_Team = {
  _id: string
  name: string
  secondaryName: string
  thirdName: string
  color: string
  squareLogoImage: string | null
}

export type DB_Player = {
  _id: string
  name: string
  nickname: string | null
  designation: string | null
  portraitImage: string | null
  statistics: DB_PlayerStatistics | null
}

export type DB_PlayerStatistics = {
  matchCount: number
  roundCount: number
  point: number
  scoreMax: number
  scoreMin: number
  firstCount: number
  secondCount: number
  thirdCount: number
  fourthCount: number
  riichiCount: number
  revealCount: number
  waitingCount: number
  ronCount: number
  ronCountWhenEast: number
  ronCountWhenNonEast: number
  waitingWhenExhaustedCount: number
  ronPureScoreAvg: number
  ronPureScoreAvgWhenEast: number
  ronPureScoreAvgWhenNonEast: number
  ronHighYakuCount: number
  chuckCount: number
  chuckCountWhenEast: number
  chuckCountWhenNonEast: number
  chuckPureScoreAvg: number
  chuckPureScoreAvgWhenEast: number
  chuckPureScoreAvgWhenNonEast: number
  chuckHighYakuCount: number
  ronAfterRiichiCount: number
  ronAfterRiichiPureScoreAvg: number
  ronAfterRevealCount: number
  ronAfterRevealPureScoreAvg: number
  chuckAfterRiichiCount: number
  chuckAfterRiichiPureScoreAvg: number
  chuckAfterRevealCount: number
  chuckAfterRevealPureScoreAvg: number

  pointRanking: number
  nonFourthP: number
  nonFourthPRanking: number
  firstAndSecondP: number
  firstAndSecondPRanking: number
  riichiP: number
  riichiPRanking: number
  ronP: number
  ronPRanking: number
  chuckP: number
  chuckPRanking: number
  revealP: number
  revealPRanking: number
  ronPureScoreAvgRanking: number
  chuckPureScoreAvgRanking: number
}

export type DB_MatchResult = {
  ranking: '1' | '2' | '3' | '4'
  point: number
  score: number
}

export type DB_MatchRound = {
  _key: string
  code: string
  type: 'ron' | 'tsumo' | 'exhausted' | 'hotfix'
  playerEast: DB_MatchRoundPlayer
  playerSouth: DB_MatchRoundPlayer
  playerWest: DB_MatchRoundPlayer
  playerNorth: DB_MatchRoundPlayer
}

export type DB_MatchRoundPlayer = {
  position: 'east' | 'south' | 'west' | 'north'
  type: 'none' | 'win' | 'lose'
  status: 'none' | 'isRiichied' | 'isRevealed'
  isWaited: boolean
  beforeScore: number
  afterScore: number
  dora?: number
  redDora?: number
  innerDora?: number
  han?: number
  fu?: number
  pureScore?: number
  yaku?: string
}

export type DB_MatchTournament = {
  _id: string
  name: string
  logoUrl: string
  startingScore: '25000' | '30000' | '35000' | '50000' | '100000'
  isManganRoundUp: boolean
  yakuMax: '12' | '13'
  yakumanMax: '13' | '26' | '39' | '130'
  teams: {
    _id: string
    point: number
    ranking: number
    matchCount: number
    pointHistories: number[]
    rankingHistories: number[]
    team: DB_Team
  }[]
}

export type TournamentTeam = {
  _key: string
  ref: Team
  overrided: Team
  players: {
    _key: string
    ref: Player
    overrided: Player
  }[]

  statistics?: {
    ranking: number
    point: number
    matchCount: number
    firstP: number
    secondP: number
    thirdP: number
    fourthP: number
    rankingAvg: number
    pointAvg: number
    ronP: number
    chuckP: number
    riichiP: number
    revealP: number
  }
}

export type TournamentTeamWithPlayers = TournamentTeam & {
  players: {
    ref: Player
    overrided: Player
  }[]
}

export type TournamentTeamWithPlayersWithStatistics = TournamentTeam & {
  players: {
    ref: Player
    overrided: Player
  }[]
  statistics: {
    matchCount: number
    point: number
    ranking: number
    pointHistories: []
  }
}

export const apiGetPlayers = (): Promise<DB_Player[]> => {
  return client.fetch<DB_Player[]>('*[_type == "player"]')
}

export const apiGetMatches = async () => {
  const regularTeams = await getRegularTeamsWithPlayers()
  return client
    .fetch<
      RawMatch[]
    >(`*[_type == "match" && !(_id in path("drafts.**")) && (status == "initialized" || status == "streaming")] | order(startAt asc)[0...10]{ _id, name, playerEast, playerSouth, playerWest, playerNorth, playerEastTeam, playerSouthTeam, playerWestTeam, playerNorthTeam, startAt, tournament->{_id, name, "logoUrl": logo.asset->url} }`)
    .then((matches) =>
      matches.map((rawMatch) => {
        const teamEast = regularTeams.find(
          ({ team }) => rawMatch.playerEastTeam?._ref === team._id
        )
        const playerEast = teamEast?.players.find(
          ({ _id }) => _id === rawMatch.playerEast?._ref
        )
        const teamSouth = regularTeams.find(
          ({ team }) => rawMatch.playerSouthTeam?._ref === team._id
        )
        const playerSouth = teamSouth?.players.find(
          ({ _id }) => _id === rawMatch.playerSouth?._ref
        )
        const teamWest = regularTeams.find(
          ({ team }) => rawMatch.playerWestTeam?._ref === team._id
        )
        const playerWest = teamWest?.players.find(
          ({ _id }) => _id === rawMatch.playerWest?._ref
        )
        const teamNorth = regularTeams.find(
          ({ team }) => rawMatch.playerNorthTeam?._ref === team._id
        )
        const playerNorth = teamNorth?.players.find(
          ({ _id }) => _id === rawMatch.playerNorth?._ref
        )

        const match: Match = {
          ...rawMatch,
          playerEast,
          playerSouth,
          playerWest,
          playerNorth,
          playerEastTeam: teamEast?.team,
          playerSouthTeam: teamSouth?.team,
          playerWestTeam: teamWest?.team,
          playerNorthTeam: teamNorth?.team,
        }

        return match
      })
    )
}

export const apiGetMatchById = async (matchId: string) => {
  const regularTeams = await getRegularTeamsWithPlayers()
  return client
    .fetch<
      RawMatch[]
    >(`*[_type == "match" && _id == "${matchId}"]{ tournament->{_id, name, "logoUrl": logo.asset->url}, _id, name, playerEast, playerSouth, playerWest, playerNorth, playerEastTeam, playerSouthTeam, playerWestTeam, playerNorthTeam, startAt }`)
    .then((rawMatches) => {
      const rawMatch = rawMatches[0]

      const teamEast = regularTeams.find(
        ({ team }) => rawMatch.playerEastTeam?._ref === team._id
      )
      const playerEast = teamEast?.players.find(
        ({ _id }) => _id === rawMatch.playerEast?._ref
      )
      const teamSouth = regularTeams.find(
        ({ team }) => rawMatch.playerSouthTeam?._ref === team._id
      )
      const playerSouth = teamSouth?.players.find(
        ({ _id }) => _id === rawMatch.playerSouth?._ref
      )
      const teamWest = regularTeams.find(
        ({ team }) => rawMatch.playerWestTeam?._ref === team._id
      )
      const playerWest = teamWest?.players.find(
        ({ _id }) => _id === rawMatch.playerWest?._ref
      )
      const teamNorth = regularTeams.find(
        ({ team }) => rawMatch.playerNorthTeam?._ref === team._id
      )
      const playerNorth = teamNorth?.players.find(
        ({ _id }) => _id === rawMatch.playerNorth?._ref
      )

      const match: Match = {
        ...rawMatch,
        playerEast,
        playerSouth,
        playerWest,
        playerNorth,
        playerEastTeam: teamEast?.team,
        playerSouthTeam: teamSouth?.team,
        playerWestTeam: teamWest?.team,
        playerNorthTeam: teamNorth?.team,
      }

      return match
    })
}

export const apiGetMatchByIdWithStatistics = async (
  matchId: string,
  statisticTournamentId?: string
) => {
  const regularTeams = await getRegularTeamsWithPlayersWithStatistics()
  const rawMatch = await client
    .fetch<
      RawMatch[]
    >(`*[_type == "match" && _id == "${matchId}"]{ tournament->{_id, name, "logoUrl": logo.asset->url}, _id, name, playerEast, playerSouth, playerWest, playerNorth, playerEastTeam, playerSouthTeam, playerWestTeam, playerNorthTeam, startAt }`)
    .then((rawMatches) => rawMatches[0])

  const teamEast = regularTeams.find(
    ({ team }) => rawMatch.playerEastTeam?._ref === team._id
  )
  const playerEast = teamEast?.players.find(
    ({ _id }) => _id === rawMatch.playerEast?._ref
  )
  const teamSouth = regularTeams.find(
    ({ team }) => rawMatch.playerSouthTeam?._ref === team._id
  )
  const playerSouth = teamSouth?.players.find(
    ({ _id }) => _id === rawMatch.playerSouth?._ref
  )
  const teamWest = regularTeams.find(
    ({ team }) => rawMatch.playerWestTeam?._ref === team._id
  )
  const playerWest = teamWest?.players.find(
    ({ _id }) => _id === rawMatch.playerWest?._ref
  )
  const teamNorth = regularTeams.find(
    ({ team }) => rawMatch.playerNorthTeam?._ref === team._id
  )
  const playerNorth = teamNorth?.players.find(
    ({ _id }) => _id === rawMatch.playerNorth?._ref
  )

  const playerIds = [
    playerEast!._id,
    playerSouth!._id,
    playerWest!._id,
    playerNorth!._id,
  ]

  const playerStatisticMap = await getStatisticsByPlayerIds(
    playerIds,
    statisticTournamentId || rawMatch.tournament._id
  )

  return {
    ...rawMatch,
    playerEast: {
      ...playerEast!,
      statistic: playerStatisticMap[playerEast!._id],
    },
    playerSouth: {
      ...playerSouth!,
      statistic: playerStatisticMap[playerSouth!._id],
    },
    playerWest: {
      ...playerWest!,
      statistic: playerStatisticMap[playerWest!._id],
    },
    playerNorth: {
      ...playerNorth!,
      statistic: playerStatisticMap[playerNorth!._id],
    },
    playerEastTeam: {
      ...teamEast!.team,
      statistic: teamEast!.statistics,
      players: teamEast!.players,
    },
    playerSouthTeam: {
      ...teamSouth!.team,
      statistic: teamSouth!.statistics,
      players: teamSouth!.players,
    },
    playerWestTeam: {
      ...teamWest!.team,
      statistic: teamWest!.statistics,
      players: teamWest!.players,
    },
    playerNorthTeam: {
      ...teamNorth!.team,
      statistic: teamNorth!.statistics,
      players: teamNorth!.players,
    },
  }
}

export const getStatisticsByPlayerIds = async (
  playerIds: string[],
  tournamentId: string
) =>
  client
    .fetch<
      { _id: string; statistics: DB_PlayerStatistics }[]
    >(`*[_type=="player" && _id in [${playerIds.map((playerId) => `"${playerId}"`).join(',')}]]{ _id, "statistics": statistics[_key=="${tournamentId}"][0] }`)
    .then((thisResult) =>
      thisResult.reduce(
        (prev, player) => {
          if (!player.statistics || player.statistics.matchCount <= 0) {
            return prev
          }

          const statisticsDTO = {
            point: player.statistics.point,
            matchCount: player.statistics.matchCount,
            nonFourthP: player.statistics.nonFourthP,
            firstAndSecondP: player.statistics.firstAndSecondP,
            ronP: player.statistics.ronP,
            riichiP: player.statistics.riichiP,
            chuckP: player.statistics.chuckP,
            revealP: player.statistics.revealP,
            ronPureScoreAvg: player.statistics.ronPureScoreAvg,
            chuckPureScoreAvg: player.statistics.chuckPureScoreAvg,
            pointRanking: player.statistics.pointRanking,
            nonFourthPRanking: player.statistics.nonFourthPRanking,
            firstAndSecondPRanking: player.statistics.firstAndSecondPRanking,
            ronPRanking: player.statistics.ronPRanking,
            riichiPRanking: player.statistics.riichiPRanking,
            chuckPRanking: player.statistics.chuckPRanking,
            revealPRanking: player.statistics.revealPRanking,
            ronPureScoreAvgRanking: player.statistics.ronPureScoreAvgRanking,
            chuckPureScoreAvgRanking:
              player.statistics.chuckPureScoreAvgRanking,
          }

          prev[player._id] = statisticsDTO
          return prev
        },
        {} as Record<string, PlayerStatistic>
      )
    )

export const convertDbTeamPlayerToRealtimePlayer = (
  team: Team,
  player: Player
): RealtimePlayer => {
  return {
    primaryName: player.name!,
    secondaryName: team.name!,
    nickname: player.nickname!,
    color: team.color,
    logoUrl: `${team.squareLogoImage}?w=500&h=500`,
    propicUrl: `${player.portraitImage}?w=360&h=500`,
    largeLogoUrl: `${team.squareLogoImage}?w=1000&h=1000`,
  }
}

export type TeamPlayerDTO = {
  playerId: string
  playerName: string
  playerNickname: string
  playerDesignation: string
  playerFullname: string
  playerPortraitImageUrl: string
  teamId: string
  teamFullname: string
  teamName: string
  teamSecondaryName: string
  teamThirdName: string
  color: string
  teamLogoImageUrl: string
  playerStatistic: PlayerStatistic | null
  teamStatistic: TeamStatisticDTO | null
}

export type PlayerStatistic = {
  point: number
  pointRanking: number
  matchCount: number
  nonFourthP: number
  nonFourthPRanking: number
  firstAndSecondP: number
  firstAndSecondPRanking: number
  riichiP: number
  riichiPRanking: number
  ronP: number
  ronPRanking: number
  chuckP: number
  chuckPRanking: number
  revealP: number
  revealPRanking: number
  ronPureScoreAvg: number
  ronPureScoreAvgRanking: number
  chuckPureScoreAvg: number
  chuckPureScoreAvgRanking: number
}

export type TeamStatisticDTO = {
  point: number
  ranking: number
  matchCount: number
  _id: string
}

export type MatchDTO = Omit<
  DB_Match,
  | 'playerEast'
  | 'playerSouth'
  | 'playerWest'
  | 'playerNorth'
  | 'playerEastTeam'
  | 'playerSouthTeam'
  | 'playerWestTeam'
  | 'playerNorthTeam'
> & {
  playerEast: TeamPlayerDTO
  playerSouth: TeamPlayerDTO
  playerWest: TeamPlayerDTO
  playerNorth: TeamPlayerDTO
  nameAlt: string
  _order: ('playerEast' | 'playerSouth' | 'playerWest' | 'playerNorth')[]
}

export const formatTeamPlayerDTO = (
  placeholderTeam: DB_Team | null | undefined,
  teamPlayer?: DB_TeamPlayer | null | undefined
): TeamPlayerDTO => {
  const newTeamPlayerDTO: TeamPlayerDTO = {
    playerId: '',
    playerName: '',
    playerNickname: '',
    playerDesignation: '',
    playerPortraitImageUrl:
      'https://hkleague2025.hkmahjong.org/images/empty.png',
    playerFullname: '',
    playerStatistic: null,
    teamId: '',
    teamName: '',
    teamSecondaryName: '',
    teamThirdName: '',
    teamFullname: '',
    teamStatistic: null,
    color: '#000000',
    teamLogoImageUrl: 'https://hkleague2025.hkmahjong.org/images/empty.png',
  }

  if (teamPlayer) {
    if (teamPlayer.player) {
      newTeamPlayerDTO.playerId = teamPlayer.player._id
      newTeamPlayerDTO.playerName = teamPlayer.player.name
      if (teamPlayer.player.nickname) {
        newTeamPlayerDTO.playerNickname = teamPlayer.player.nickname
      }
      if (teamPlayer.player.designation) {
        newTeamPlayerDTO.playerDesignation = teamPlayer.player.designation
      }
      if (teamPlayer.player.portraitImage) {
        newTeamPlayerDTO.playerPortraitImageUrl =
          teamPlayer.player.portraitImage
      }

      const stat = teamPlayer.player.statistics

      newTeamPlayerDTO.playerStatistic =
        stat && stat.matchCount > 0
          ? {
              point: stat.point,
              pointRanking: stat.pointRanking,
              matchCount: stat.matchCount,
              nonFourthP: stat.nonFourthP,
              nonFourthPRanking: stat.nonFourthPRanking,
              firstAndSecondP: stat.firstAndSecondP,
              firstAndSecondPRanking: stat.firstAndSecondPRanking,
              riichiP: stat.riichiP,
              riichiPRanking: stat.riichiPRanking,
              ronP: stat.ronP,
              ronPRanking: stat.ronPRanking,
              chuckP: stat.chuckP,
              chuckPRanking: stat.chuckPRanking,
              revealP: stat.revealP,
              revealPRanking: stat.revealPRanking,
              ronPureScoreAvg: stat.ronPureScoreAvg,
              ronPureScoreAvgRanking: stat.ronPureScoreAvgRanking,
              chuckPureScoreAvg: stat.chuckPureScoreAvg,
              chuckPureScoreAvgRanking: stat.chuckPureScoreAvgRanking,
            }
          : null
    }

    if (teamPlayer.team) {
      newTeamPlayerDTO.teamId = teamPlayer.team._id
      newTeamPlayerDTO.teamName = teamPlayer.team.name
      newTeamPlayerDTO.teamSecondaryName = teamPlayer.team.secondaryName
      newTeamPlayerDTO.teamThirdName = teamPlayer.team.thirdName
      newTeamPlayerDTO.color = teamPlayer.team.color
      if (teamPlayer.team.squareLogoImage) {
        newTeamPlayerDTO.teamLogoImageUrl = teamPlayer.team.squareLogoImage
      }
    }

    newTeamPlayerDTO.playerFullname =
      newTeamPlayerDTO.playerName +
      (newTeamPlayerDTO.playerNickname
        ? ` (${newTeamPlayerDTO.playerNickname})`
        : '')
    newTeamPlayerDTO.teamFullname = [
      newTeamPlayerDTO.teamName,
      newTeamPlayerDTO.teamSecondaryName,
      newTeamPlayerDTO.teamThirdName,
    ]
      .filter((item) => !!item)
      .join(' ')

    newTeamPlayerDTO.playerDesignation = newTeamPlayerDTO.teamFullname

    if (teamPlayer.overridedDesignation) {
      newTeamPlayerDTO.playerDesignation = teamPlayer.overridedDesignation
    }
    if (teamPlayer.overridedName) {
      newTeamPlayerDTO.playerName = teamPlayer.overridedName
    }
    if (teamPlayer.overridedNickname) {
      newTeamPlayerDTO.playerNickname = teamPlayer.overridedNickname
    }
    if (teamPlayer.overridedColor) {
      newTeamPlayerDTO.color = teamPlayer.overridedColor
    }
    if (teamPlayer.overridedPortraitImage) {
      newTeamPlayerDTO.playerPortraitImageUrl =
        teamPlayer.overridedPortraitImage
    }
  } else if (placeholderTeam) {
    newTeamPlayerDTO.teamId = placeholderTeam._id
    newTeamPlayerDTO.teamName = placeholderTeam.name
    newTeamPlayerDTO.teamSecondaryName = placeholderTeam.secondaryName
    newTeamPlayerDTO.teamThirdName = placeholderTeam.thirdName
    newTeamPlayerDTO.color = placeholderTeam.color
    if (placeholderTeam.squareLogoImage) {
      newTeamPlayerDTO.teamLogoImageUrl = placeholderTeam.squareLogoImage
    }

    newTeamPlayerDTO.teamFullname = [
      newTeamPlayerDTO.teamName,
      newTeamPlayerDTO.teamSecondaryName,
      newTeamPlayerDTO.teamThirdName,
    ]
      .filter((item) => !!item)
      .join(' ')
  }

  return newTeamPlayerDTO
}

export const apiGetTournament = async (tournamentId: string) => {
  const tournament = await client.fetch<DB_MatchTournament>(
    `*[_type == "matchTournament" && _id == "${tournamentId}"][0]{..., "logoUrl": logo.asset->url, teams[]{..., team->{${TEAM_PROJECTION}}}}`
  )

  return tournament
}

export const apiGetTeamPlayersOfTournament = async (tournamentId: string) => {
  const teamPlayers = await client.fetch<
    (DB_TeamPlayer & {
      teamId: string
    })[]
  >(
    `*[_type=="teamPlayer" && !(_id in path("drafts.**")) && count(player->statistics[_key=="${tournamentId}"]) > 0]{"teamId": team._ref, player->{${PLAYER_PROJECTION}, "statistics": statistics[_key=="${tournamentId}"][0]}, overridedDesignation, overridedName, overridedNickname, "overridedColor": overridedColor.hex, "overridedPortraitImage": overridedPortraitImage.asset->url}`
  )

  return teamPlayers
}

export const getRegularTeamsWithStatistics = async () =>
  client
    .fetch(
      `*[_type == "matchTournament" && _id == "62e7d07d-f59f-421d-a000-2e4d28ab89db"]{ teams[]{ _key, "statistics": statistics{ranking}, ref->{${[
        '_id',
        ...TEAM_META_FIELDS,
      ].join(', ')}}, "overrided": overrided{${[...TEAM_META_FIELDS].join(
        ', '
      )}} } }`
    )
    .then((tournaments) => {
      return (
        tournaments[0]?.teams as TournamentTeamWithPlayersWithStatistics[]
      ).map(({ ref, overrided, ...team }) => ({
        ...team,
        team: mergeObject(ref, overrided),
      }))
    })

export const getRegularTeamsWithPlayers = () =>
  client
    .fetch(
      `*[_type == "matchTournament" && _id == "62e7d07d-f59f-421d-a000-2e4d28ab89db"]{ teams[]{ _key, ref->{${[
        '_id',
        ...TEAM_META_FIELDS,
      ].join(', ')}}, "overrided": overrided{${[...TEAM_META_FIELDS].join(
        ', '
      )}}, players[]{ref->{${['_id', ...PLAYER_META_FIELDS].join(
        ', '
      )}}, "overrided": overrided{${[...PLAYER_META_FIELDS].join(', ')}} } } }`
    )
    .then((tournaments) => {
      return (tournaments[0]?.teams as TournamentTeamWithPlayers[]).map(
        ({ ref, overrided, ...team }) => ({
          ...team,
          team: mergeObject(ref, overrided),
          players: team.players.map((player) =>
            mergeObject(player.ref, player.overrided)
          ),
        })
      )
    })

export const getRegularTeamsWithPlayersWithStatistics = () =>
  client
    .fetch(
      `*[_type == "matchTournament" && _id == "62e7d07d-f59f-421d-a000-2e4d28ab89db"]{ teams[]{ _key, statistics, ref->{${[
        '_id',
        ...TEAM_META_FIELDS,
      ].join(', ')}}, "overrided": overrided{${[...TEAM_META_FIELDS].join(
        ', '
      )}}, players[]{ref->{${['_id', ...PLAYER_META_FIELDS].join(
        ', '
      )}}, "overrided": overrided{${[...PLAYER_META_FIELDS].join(', ')}} } } }`
    )
    .then((tournaments) => {
      return (
        tournaments[0]?.teams as TournamentTeamWithPlayersWithStatistics[]
      ).map(({ ref, overrided, ...team }) => ({
        ...team,
        team: mergeObject(ref, overrided),
        players: team.players.map((player) =>
          mergeObject(player.ref, player.overrided)
        ),
      }))
    })
