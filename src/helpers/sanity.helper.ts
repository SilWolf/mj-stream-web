import { Player } from '@/models'
import { createClient } from '@sanity/client'

const PLAYER_PROJECTION = `_id, name, nickname, designation, "portraitImage": portraitImage.asset->url`
const TEAM_PROJECTION = `_id, "slug": slug.current, name, "squareLogoImage": squareLogoImage.asset->url, "color": color.hex, description`
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
}

export type DB_MatchTournament = {
  _id: string
  name: string
  logoUrl: string
  startingScore: '25000' | '30000' | '35000' | '50000' | '100000'
  isManganRoundUp: boolean
  yakuMax: '12' | '13'
  yakumanMax: '13' | '26' | '39' | '130'
  teams: { _id: string; point: number; ranking: number; matchCount: number }[]
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
    .fetch<DB_Match[]>(
      `*[_type == "match" && !(_id in path("drafts.**")) && (status == "initialized" || status == "streaming")] | order(startAt asc)[0...5]{ _id, name, playerEast->{${TEAM_PLAYER_PROJECTION}}, playerSouth->{${TEAM_PLAYER_PROJECTION}}, playerWest->{${TEAM_PLAYER_PROJECTION}}, playerNorth->{${TEAM_PLAYER_PROJECTION}}, playerEastTeam->{${TEAM_PROJECTION}}, playerSouthTeam->{${TEAM_PROJECTION}}, playerWestTeam->{${TEAM_PROJECTION}}, playerNorthTeam->{${TEAM_PROJECTION}}, startAt, tournament->{_id, name, "logoUrl": logo.asset->url, startingScore, isManganRoundUp, yakuMax, yakumanMax}}`
    )
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

        return {
          ...matchRest,
          playerEast: formatTeamPlayerDTO(playerEastTeam, playerEast),
          playerSouth: formatTeamPlayerDTO(playerSouthTeam, playerSouth),
          playerWest: formatTeamPlayerDTO(playerWestTeam, playerWest),
          playerNorth: formatTeamPlayerDTO(playerNorthTeam, playerNorth),
        }
      })
    )
}

export const apiGetMatchById = async (
  matchId: string,
  withStatistics?: boolean
): Promise<MatchDTO | undefined> => {
  const match = await client
    .fetch<DB_Match[]>(
      `*[_type == "match" && _id == "${matchId}"]{ _id, name, playerEast->{${TEAM_PLAYER_PROJECTION}}, playerSouth->{${TEAM_PLAYER_PROJECTION}}, playerWest->{${TEAM_PLAYER_PROJECTION}}, playerNorth->{${TEAM_PLAYER_PROJECTION}}, playerEastTeam->{${TEAM_PROJECTION}}, playerSouthTeam->{${TEAM_PROJECTION}}, playerWestTeam->{${TEAM_PROJECTION}}, playerNorthTeam->{${TEAM_PROJECTION}}, startAt, youtubeUrl, bilibiliUrl, result, rounds, tournament->{_id, name, "logoUrl": logo.asset->url, startingScore, isManganRoundUp, yakuMax, yakumanMax, teams[]{ "_id": team._ref, matchCount, ranking, point }}}`
    )
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

      return {
        ...match,
        playerEast: formatTeamPlayerDTO(playerEastTeam, playerEast),
        playerSouth: formatTeamPlayerDTO(playerSouthTeam, playerSouth),
        playerWest: formatTeamPlayerDTO(playerWestTeam, playerWest),
        playerNorth: formatTeamPlayerDTO(playerNorthTeam, playerNorth),
      }
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
  }

  return match
}

export const getStatisticsByPlayerIds = async (
  playerIds: string[],
  tournamentId: string
) =>
  client
    .fetch<{ _id: string; statistics: DB_PlayerStatistics }[]>(
      `*[_type=="player" && _id in [${playerIds
        .map((playerId) => `"${playerId}"`)
        .join(
          ','
        )}]]{ _id, "statistics": statistics[_key=="${tournamentId}"][0] }`
    )
    .then((thisResult) =>
      thisResult.reduce(
        (prev, player) => {
          if (!player.statistics || player.statistics.matchCount <= 0) {
            return prev
          }

          const statisticsDTO = {
            point: player.statistics.point,
            matchCount: player.statistics.matchCount,
            nonFourthP:
              1 - player.statistics.fourthCount / player.statistics.matchCount,
            firstAndSecondP:
              (player.statistics.firstCount + player.statistics.secondCount) /
              player.statistics.matchCount,
            riichiP:
              player.statistics.riichiCount / player.statistics.roundCount,
            ronP: player.statistics.ronCount / player.statistics.roundCount,
            chuckP: player.statistics.chuckCount / player.statistics.roundCount,
            revealP:
              player.statistics.revealCount / player.statistics.roundCount,
            ronPureScoreAvg: player.statistics.ronPureScoreAvg,
            chuckPureScoreAvg: player.statistics.chuckPureScoreAvg,
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
  teamName: string
  color: string
  teamLogoImageUrl: string
  playerStatistic: PlayerStatisticDTO | null
  teamStatistic: TeamStatisticDTO | null
}

export type PlayerStatisticDTO = {
  point: number
  matchCount: number
  nonFourthP: number
  firstAndSecondP: number
  riichiP: number
  ronP: number
  chuckP: number
  revealP: number
  ronPureScoreAvg: number
  chuckPureScoreAvg: number
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
}

export const formatTeamPlayerDTO = (
  placeholderTeam: DB_Team | null | undefined,
  teamPlayer?: DB_TeamPlayer | null | undefined
): TeamPlayerDTO => {
  const playerName = teamPlayer?.overridedName || teamPlayer?.player?.name || ''
  const playerNickname =
    teamPlayer?.overridedNickname || teamPlayer?.player?.nickname || ''

  const stat = teamPlayer?.player.statistics

  return {
    playerId: teamPlayer?.player._id ?? '',
    playerName,
    playerNickname,
    playerFullname: playerNickname
      ? `${playerName} (${playerNickname})`
      : playerName,
    playerDesignation:
      teamPlayer?.overridedDesignation ||
      teamPlayer?.team?.name ||
      teamPlayer?.player?.designation ||
      '',
    playerPortraitImageUrl:
      teamPlayer?.overridedPortraitImage ||
      teamPlayer?.player?.portraitImage ||
      '/images/empty.png',
    teamId: teamPlayer?.team?._id || (placeholderTeam?._id as string),
    teamName: teamPlayer?.team?.name || placeholderTeam?.name || '',
    color:
      teamPlayer?.overridedColor ||
      teamPlayer?.team?.color ||
      placeholderTeam?.color ||
      '#000000',
    teamLogoImageUrl:
      teamPlayer?.team?.squareLogoImage ||
      placeholderTeam?.squareLogoImage ||
      '/images/empty.png',
    playerStatistic:
      stat && stat.matchCount > 0
        ? {
            point: stat.point,
            matchCount: stat.matchCount,
            nonFourthP: 1 - stat.fourthCount / stat.matchCount,
            firstAndSecondP:
              (stat.firstCount + stat.secondCount) / stat.matchCount,
            riichiP: stat.riichiCount / stat.roundCount,
            ronP: stat.ronCount / stat.roundCount,
            chuckP: stat.chuckCount / stat.roundCount,
            revealP: stat.revealCount / stat.roundCount,
            ronPureScoreAvg: stat.ronPureScoreAvg,
            chuckPureScoreAvg: stat.chuckPureScoreAvg,
          }
        : null,
    teamStatistic: null,
  }
}
