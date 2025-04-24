import { q, runQuery, urlFor } from '../adapters/sanity'
import * as z from 'zod'
import { V2Match } from '../models/V2Match.model'
import { getLightColorOfColor } from '@/utils/string.util'

const playerProject = q.fragmentForType<'player'>().project((playerRef) => ({
  _id: z.string(),
  name: z.string().nullable(),
  nickname: z.string().nullable(),
  designation: z.string().nullable(),
  introduction: z.string().nullable(),
  portraitImage: playerRef.field('portraitImage.asset').field(
    '_ref',
    z
      .string()
      .nullable()
      .transform((assetId) => urlFor(assetId, { width: 360, height: 500 }))
  ),
}))

const teamProject = q.fragmentForType<'team'>().project((teamRef) => ({
  _id: z.string(),
  name: z.string().nullable(),
  secondaryName: z.string().nullable(),
  thirdName: z.string().nullable(),
  preferredName: z.string().nullable(),
  squareLogoImage: teamRef.field('squareLogoImage.asset').field(
    '_ref',
    z
      .string()
      .nullable()
      .transform((assetId) => urlFor(assetId, { width: 500, height: 500 }))
  ),
  color: teamRef.field('color.hex', z.string().nullable()),
  introduction: z.string().nullable(),
}))

export const apiQueryMatchesByTournamentId = async (tournamentId: string) => {
  const query = q.star
    .filterByType('match')
    .filterRaw(`tournament._ref == "${tournamentId}"`)
    .order('startAt asc')
    .slice(0, 10)
    .project((sub) => ({
      _id: z.string(),
      name: z.string().nullable(),
      playerEast: sub.field('playerEast').deref().project(playerProject),
      playerSouth: sub.field('playerSouth').deref().project(playerProject),
      playerWest: sub.field('playerWest').deref().project(playerProject),
      playerNorth: sub.field('playerNorth').deref().project(playerProject),
      playerEastTeam: sub.field('playerEastTeam').deref().project(teamProject),
      playerSouthTeam: sub
        .field('playerSouthTeam')
        .deref()
        .project(teamProject),
      playerWestTeam: sub.field('playerWestTeam').deref().project(teamProject),
      playerNorthTeam: sub
        .field('playerNorthTeam')
        .deref()
        .project(teamProject),
      _createdAt: true,
      _updatedAt: true,
    }))

  return runQuery(query).then((matches) => {
    const formatPlayer = (
      player: (typeof matches)[number]['playerEast'],
      team: (typeof matches)[number]['playerEastTeam']
    ) => ({
      id: player?._id ?? '',
      teamId: team?._id ?? '',
      color: {
        primary: team?.color ?? '#FFFF00',
        secondary: getLightColorOfColor(team?.color ?? '#FFFF00'),
      },
      name: {
        official: {
          primary: player?.name ?? '',
          secondary: player?.designation ?? '',
          third: player?.nickname ?? '',
        },
        display: {
          primary: player?.name ?? '',
          secondary: team?.preferredName ?? '',
          third: player?.nickname ?? '',
        },
      },
      image: {
        portrait: {
          default: {
            url: player?.portraitImage ?? '',
          },
        },
        logo: {
          default: {
            url: team?.squareLogoImage ?? '',
          },
        },
      },
    })

    return matches.map((match) => {
      return {
        schemaVersion: '2',
        code: match._id,
        data: {
          name: match.name ?? '',
          players: [
            formatPlayer(match.playerEast, match.playerEastTeam),
            formatPlayer(match.playerSouth, match.playerSouthTeam),
            formatPlayer(match.playerWest, match.playerWestTeam),
            formatPlayer(match.playerNorth, match.playerNorthTeam),
          ],
          rulesetRef: 'hkleague-4p',
        },
        metadata: {
          createdAt: match._createdAt,
          updatedAt: match._updatedAt,
        },
      } satisfies V2Match
    })
  })
}
