import { Player } from '@/models'
import { createClient } from '@sanity/client'

const PLAYER_PROJECTION = `{_id, name, nickname, designation, "portraitImage": portraitImage.asset->url}`
const TEAM_PROJECTION = `{_id, "slug": slug.current, name, "squareLogoImage": squareLogoImage.asset->url, "color": color.hex, description}`
const TEAM_PLAYER_PROJECTION = `{team->${TEAM_PROJECTION}, player->${PLAYER_PROJECTION}, overridedDesignation, overridedName, overridedNickname, "overridedColor": overridedColor.hex, "overridedPortraitImage": overridedPortraitImage.asset->url}`

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
  name: string
  color: string
  squareLogoImage: string | null
}

export type DB_Player = {
  name: string
  nickname: string | null
  designation: string | null
  portraitImage: string | null
}

export type DB_MatchTournament = {
  name: string
  startingScore: '25000' | '30000' | '35000' | '50000' | '100000'
  isManganRoundUp: boolean
  yakuMax: '12' | '13'
  yakumanMax: '13' | '26' | '39' | '130'
}

export const apiGetPlayers = (): Promise<DB_Player[]> => {
  return client.fetch<DB_Player[]>('*[_type == "player"]')
}

export const apiGetMatches = (): Promise<MatchDTO[]> => {
  return client
    .fetch<DB_Match[]>(
      `*[_type == "match" && !(_id in path("drafts.**")) && (status == "initialized" || status == "streaming")]{ _id, name, playerEast->${TEAM_PLAYER_PROJECTION}, playerSouth->${TEAM_PLAYER_PROJECTION}, playerWest->${TEAM_PLAYER_PROJECTION}, playerNorth->${TEAM_PLAYER_PROJECTION}, playerEastTeam->${TEAM_PROJECTION}, playerSouthTeam->${TEAM_PROJECTION}, playerWestTeam->${TEAM_PROJECTION}, playerNorthTeam->${TEAM_PROJECTION}, startAt, tournament->}`
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

export const apiGetMatchById = (
  matchId: string
): Promise<MatchDTO | undefined> => {
  return client
    .fetch<DB_Match[]>(
      `*[_type == "match" && _id == "${matchId}"]{ _id, name, playerEast->${TEAM_PLAYER_PROJECTION}, playerSouth->${TEAM_PLAYER_PROJECTION}, playerWest->${TEAM_PLAYER_PROJECTION}, playerNorth->${TEAM_PLAYER_PROJECTION}, playerEastTeam->${TEAM_PROJECTION}, playerSouthTeam->${TEAM_PROJECTION}, playerWestTeam->${TEAM_PROJECTION}, playerNorthTeam->${TEAM_PROJECTION}, startAt, youtubeUrl, bilibiliUrl, result, rounds, tournament->}`
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
}

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
  playerName: string
  playerNickname: string
  playerDesignation: string
  playerFullname: string
  playerPortraitImageUrl: string
  teamName: string
  color: string
  teamLogoImageUrl: string
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
  team: DB_Team | null | undefined,
  teamPlayer?: DB_TeamPlayer | null | undefined
): TeamPlayerDTO => {
  const playerName = teamPlayer?.overridedName || teamPlayer?.player?.name || ''
  const playerNickname =
    teamPlayer?.overridedNickname || teamPlayer?.player?.nickname || ''

  return {
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
      teamPlayer?.player.portraitImage ||
      '/images/empty.png',
    teamName: teamPlayer?.team?.name || team?.name || '',
    color:
      teamPlayer?.overridedColor ||
      teamPlayer?.team?.color ||
      team?.color ||
      '#000000',
    teamLogoImageUrl:
      teamPlayer?.team?.squareLogoImage ||
      team?.squareLogoImage ||
      '/images/empty.png',
  }
}
