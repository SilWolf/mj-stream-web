import { Player } from '@/models'
import { createClient } from '@sanity/client'

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
  playerEast: DB_TeamPlayer
  playerSouth: DB_TeamPlayer
  playerWest: DB_TeamPlayer
  playerNorth: DB_TeamPlayer
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

export const apiGetMatches = () => {
  return client.fetch<DB_Match[]>(
    '*[_type == "match" && !(_id in path("drafts.**")) && (status == "initialized" || status == "streaming")]{ _id, name, playerEast->{team->{name, "squareLogoImage": squareLogoImage.asset->url, "color": color.hex}, player->{name, designation, "portraitImage": portraitImage.asset->url}, overridedDesignation, overridedName, "overridedColor": overridedColor.hex, "overridedPortraitImage": overridedPortraitImage.asset->url}, playerSouth->{team->{name, "squareLogoImage": squareLogoImage.asset->url, "color": color.hex}, player->{name, designation, "portraitImage": portraitImage.asset->url}, overridedDesignation, overridedName, overridedColor, "overridedPortraitImage": overridedPortraitImage.asset->url}, playerWest->{team->{name, "squareLogoImage": squareLogoImage.asset->url, "color": color.hex}, player->{name, designation, "portraitImage": portraitImage.asset->url}, overridedDesignation, overridedName, overridedColor, "overridedPortraitImage": overridedPortraitImage.asset->url}, playerNorth->{team->{name, "squareLogoImage": squareLogoImage.asset->url, "color": color.hex}, player->{name, designation, "portraitImage": portraitImage.asset->url}, overridedDesignation, overridedName, overridedColor, "overridedPortraitImage": overridedPortraitImage.asset->url},tournament->}'
  )
}

export const apiGetMatchById = (
  matchId: string
): Promise<DB_Match | undefined> => {
  return client
    .fetch<DB_Match[]>(
      `*[_type == "match" && _id == "${matchId}" && (status == "initialized" || status == "streaming")]{ _id, name, playerEast->{team->{name, "squareLogoImage": squareLogoImage.asset->url, "color": color.hex}, player->{name, designation, "portraitImage": portraitImage.asset->url, nickname}, overridedDesignation, overridedName, overridedNickname, isHideNickname, "overridedColor": overridedColor.hex, "overridedPortraitImage": overridedPortraitImage.asset->url}, playerSouth->{team->{name, "squareLogoImage": squareLogoImage.asset->url, "color": color.hex}, player->{name, designation, "portraitImage": portraitImage.asset->url, nickname}, overridedDesignation, overridedName, overridedNickname, isHideNickname, overridedColor, "overridedPortraitImage": overridedPortraitImage.asset->url}, playerWest->{team->{name, "squareLogoImage": squareLogoImage.asset->url, "color": color.hex}, player->{name, designation, "portraitImage": portraitImage.asset->url, nickname}, overridedDesignation, overridedName, overridedNickname, isHideNickname, overridedColor, "overridedPortraitImage": overridedPortraitImage.asset->url}, playerNorth->{team->{name, "squareLogoImage": squareLogoImage.asset->url, "color": color.hex}, player->{name, designation, "portraitImage": portraitImage.asset->url, nickname}, overridedDesignation, overridedName, overridedNickname, isHideNickname, overridedColor, "overridedPortraitImage": overridedPortraitImage.asset->url},tournament->}`
    )
    .then((matches) => matches[0])
}

export const convertDbTeamPlayerToPlayer = (
  teamPlayer: DB_TeamPlayer
): Player => {
  const portraitImage =
    teamPlayer.overridedPortraitImage || teamPlayer.player.portraitImage
      ? `${
          teamPlayer.overridedPortraitImage ?? teamPlayer.player.portraitImage
        }?w=360&h=500`
      : null
  const squareLogoImage = teamPlayer.team.squareLogoImage
    ? `${teamPlayer.team.squareLogoImage}?w=500&h=500`
    : ''
  const largeSquareLogoImage = teamPlayer.team.squareLogoImage
    ? `${teamPlayer.team.squareLogoImage}?w=1000&h=1000`
    : ''
  const designation =
    teamPlayer.overridedDesignation ??
    teamPlayer.team.name ??
    teamPlayer.player.designation
  const name = teamPlayer.overridedName ?? teamPlayer.player.name
  const color = teamPlayer.overridedColor ?? teamPlayer.team.color

  return {
    name,
    nickname: teamPlayer.isHideNickname
      ? ''
      : teamPlayer.overridedNickname || teamPlayer.player.nickname || '',
    color,
    title: designation,
    teamPicUrl: squareLogoImage,
    largeTeamPicUrl: largeSquareLogoImage,
    proPicUrl: portraitImage,
  }
}
