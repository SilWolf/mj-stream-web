import { Player } from '@/models'
import { createClient } from '@sanity/client'

const PLAYER_PROJECTION = `_id, name, nickname, designation, "portraitImage": portraitImage.asset->url`
const TEAM_PROJECTION = `_id, "slug": slug.current, name, secondaryName, thirdName, "squareLogoImage": squareLogoImage.asset->url, "color": color.hex, description`
const TEAM_PLAYER_PROJECTION = `team->{${TEAM_PROJECTION}}, player->{${PLAYER_PROJECTION}}, overridedDesignation, overridedName, overridedNickname, "overridedColor": overridedColor.hex, "overridedPortraitImage": overridedPortraitImage.asset->url`

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

export const apiGetPlayers = (): Promise<DB_Player[]> => {
  return client.fetch<DB_Player[]>('*[_type == "player"]')
}

type DB_TeamPlayer_WithoutTeam = DB_TeamPlayer & {
  teamId: string
}
export const apiGetPlayersForIntroduction = async (
  teamIds: string[],
  tournamentId: string
): Promise<Record<string, TeamPlayerDTO[]>> => {
  const teamPlayers = await client.fetch<DB_TeamPlayer_WithoutTeam[]>(
    `*[_type == "teamPlayer" && team._ref in [${teamIds
      .map((teamId) => `"${teamId}"`)
      .join(
        ','
      )}]] | { "teamId": team._ref, player->{${PLAYER_PROJECTION}, "statistics": statistics[_key=="${tournamentId}"][0] } }`
  )

  const result: Record<string, TeamPlayerDTO[]> = {}

  for (let i = 0; i < teamPlayers.length; i++) {
    const teamPlayer = teamPlayers[i]

    if (!result[teamPlayer.teamId]) {
      result[teamPlayer.teamId] = []
    }
    result[teamPlayer.teamId].push(formatTeamPlayerDTO(null, teamPlayer))
  }

  return result
}

export const apiGetMatches = (): Promise<MatchDTO[]> => {
  return client
    .fetch<
      DB_Match[]
    >(`*[_type == "match" && !(_id in path("drafts.**")) && (status == "initialized" || status == "streaming")] | order(startAt asc)[0...10]{ _id, name, playerEast->{${TEAM_PLAYER_PROJECTION}}, playerSouth->{${TEAM_PLAYER_PROJECTION}}, playerWest->{${TEAM_PLAYER_PROJECTION}}, playerNorth->{${TEAM_PLAYER_PROJECTION}}, playerEastTeam->{${TEAM_PROJECTION}}, playerSouthTeam->{${TEAM_PROJECTION}}, playerWestTeam->{${TEAM_PROJECTION}}, playerNorthTeam->{${TEAM_PROJECTION}}, startAt, tournament->{_id, name, "logoUrl": logo.asset->url, startingScore, isManganRoundUp, yakuMax, yakumanMax}}`)
    .then((matches) =>
      matches.map((match) => {
        const {
          playerEast,
          playerEastTeam,
          playerSouth,
          playerSouthTeam,
          playerWest,
          playerWestTeam,
          playerNorth,
          playerNorthTeam,
          ...matchRest
        } = match

        const newMatch: MatchDTO = {
          ...matchRest,
          nameAlt: matchRest.name.startsWith('常規賽 #23Pre')
            ? `常規賽 ${matchRest.startAt.substring(0, 10)} 第${
                matchRest.name[matchRest.name.length - 1]
              }回戰`
            : matchRest.name,
          playerEast: formatTeamPlayerDTO(playerEastTeam, playerEast),
          playerSouth: formatTeamPlayerDTO(playerSouthTeam, playerSouth),
          playerWest: formatTeamPlayerDTO(playerWestTeam, playerWest),
          playerNorth: formatTeamPlayerDTO(playerNorthTeam, playerNorth),
          _order: ['playerEast', 'playerSouth', 'playerWest', 'playerNorth'],
        }

        if (
          playerEast &&
          playerEastTeam &&
          playerSouth &&
          playerSouthTeam &&
          playerWest &&
          playerWestTeam &&
          playerNorth &&
          playerNorthTeam
        ) {
          // assume both player and placeholder team exist

          const playersMap: Record<
            string,
            'playerEast' | 'playerSouth' | 'playerWest' | 'playerNorth'
          > = {
            [playerEast.team._id]: 'playerEast',
            [playerSouth.team._id]: 'playerSouth',
            [playerWest.team._id]: 'playerWest',
            [playerNorth.team._id]: 'playerNorth',
          }

          newMatch._order = [
            playersMap[playerEastTeam._id],
            playersMap[playerSouthTeam._id],
            playersMap[playerWestTeam._id],
            playersMap[playerNorthTeam._id],
          ]
        }

        return newMatch
      })
    )
}

export const apiGetMatchById = async (
  matchId: string,
  withStatistics?: boolean
): Promise<MatchDTO | undefined> => {
  const match = await client
    .fetch<
      DB_Match[]
    >(`*[_type == "match" && _id == "${matchId}"]{ _id, name, playerEast->{${TEAM_PLAYER_PROJECTION}}, playerSouth->{${TEAM_PLAYER_PROJECTION}}, playerWest->{${TEAM_PLAYER_PROJECTION}}, playerNorth->{${TEAM_PLAYER_PROJECTION}}, playerEastTeam->{${TEAM_PROJECTION}}, playerSouthTeam->{${TEAM_PROJECTION}}, playerWestTeam->{${TEAM_PROJECTION}}, playerNorthTeam->{${TEAM_PROJECTION}}, startAt, youtubeUrl, bilibiliUrl, result, rounds, tournament->{_id, name, "logoUrl": logo.asset->url, startingScore, isManganRoundUp, yakuMax, yakumanMax, teams[]{ "_id": team._ref, matchCount, ranking, point }}}`)
    .then((matches: DB_Match[]) => {
      const {
        playerEast,
        playerEastTeam,
        playerSouth,
        playerSouthTeam,
        playerWest,
        playerWestTeam,
        playerNorth,
        playerNorthTeam,
        ...match
      } = matches[0]

      const newMatch: MatchDTO = {
        ...match,
        nameAlt: match.name.startsWith('常規賽 #23Pre')
          ? `常規賽 ${match.startAt.substring(0, 10)} 第${
              match.name[match.name.length - 1]
            }回戰`
          : match.name,
        playerEast: formatTeamPlayerDTO(playerEastTeam, playerEast),
        playerSouth: formatTeamPlayerDTO(playerSouthTeam, playerSouth),
        playerWest: formatTeamPlayerDTO(playerWestTeam, playerWest),
        playerNorth: formatTeamPlayerDTO(playerNorthTeam, playerNorth),
        _order: ['playerEast', 'playerSouth', 'playerWest', 'playerNorth'],
      }

      if (
        playerEast &&
        playerEastTeam &&
        playerSouth &&
        playerSouthTeam &&
        playerWest &&
        playerWestTeam &&
        playerNorth &&
        playerNorthTeam
      ) {
        // assume both player and placeholder team exist

        const playersMap: Record<
          string,
          'playerEast' | 'playerSouth' | 'playerWest' | 'playerNorth'
        > = {
          [playerEast.team._id]: 'playerEast',
          [playerSouth.team._id]: 'playerSouth',
          [playerWest.team._id]: 'playerWest',
          [playerNorth.team._id]: 'playerNorth',
        }

        newMatch._order = [
          playersMap[playerEastTeam._id],
          playersMap[playerSouthTeam._id],
          playersMap[playerWestTeam._id],
          playersMap[playerNorthTeam._id],
        ]
      }

      return newMatch
    })

  if (withStatistics) {
    const playerIds = [
      match.playerEast.playerId,
      match.playerSouth.playerId,
      match.playerWest.playerId,
      match.playerNorth.playerId,
    ].filter((item) => item !== '')
    if (playerIds.length > 0) {
      const playerStatisticMap = await getStatisticsByPlayerIds(
        playerIds,
        match.tournament._id
      )
      match.playerEast.playerStatistic =
        playerStatisticMap[match.playerEast.playerId]
      match.playerSouth.playerStatistic =
        playerStatisticMap[match.playerSouth.playerId]
      match.playerWest.playerStatistic =
        playerStatisticMap[match.playerWest.playerId]
      match.playerNorth.playerStatistic =
        playerStatisticMap[match.playerNorth.playerId]
    }

    match.playerEast.teamStatistic =
      match.tournament.teams.find(
        ({ _id }) => _id === match.playerEast.teamId
      ) || null
    match.playerSouth.teamStatistic =
      match.tournament.teams.find(
        ({ _id }) => _id === match.playerSouth.teamId
      ) || null
    match.playerWest.teamStatistic =
      match.tournament.teams.find(
        ({ _id }) => _id === match.playerWest.teamId
      ) || null
    match.playerNorth.teamStatistic =
      match.tournament.teams.find(
        ({ _id }) => _id === match.playerNorth.teamId
      ) || null
  }

  return match
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
        {} as Record<string, PlayerStatisticDTO>
      )
    )

export const convertDbTeamPlayerToPlayer = (
  teamPlayer: TeamPlayerDTO
): Player => {
  const portraitImage = `${teamPlayer.playerPortraitImageUrl}?w=360&h=500`
  const squareLogoImage = `${teamPlayer.teamLogoImageUrl}?w=500&h=500`
  const largeSquareLogoImage = `${teamPlayer.teamLogoImageUrl}?w=1000&h=1000`
  const designation = teamPlayer.playerDesignation
  const name = teamPlayer.playerName
  const color = teamPlayer.color

  return {
    name,
    nickname: teamPlayer.playerNickname,
    color,
    title: designation,
    teamPicUrl: squareLogoImage,
    largeTeamPicUrl: largeSquareLogoImage,
    proPicUrl: portraitImage,
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
  playerStatistic: PlayerStatisticDTO | null
  teamStatistic: TeamStatisticDTO | null
}

export type PlayerStatisticDTO = {
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
      'https://hkleague2024.hkmahjong.org/images/empty.png',
    playerFullname: '',
    playerStatistic: null,
    teamId: '',
    teamName: '',
    teamSecondaryName: '',
    teamThirdName: '',
    teamFullname: '',
    teamStatistic: null,
    color: '#000000',
    teamLogoImageUrl: 'https://hkleague2024.hkmahjong.org/images/empty.png',
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
