import { q, runQuery, urlFor } from '../adapters/sanity'
import * as z from 'zod'
import { V2Tournament, V2TournamentTeam } from '../models/V2Tournament.model'
import { mergeObject } from '@/utils/object.util'
import { V2MatchPlayer } from '../models/V2Match.model'

export const apiGetTournaments = (): Promise<V2Tournament[]> => {
  const query = q.star
    .filterByType('matchTournament')
    .order('_createdAt desc')
    .slice(0, 10)
    .project((sub) => ({
      _id: z.string(),
      name: z.string().nullish(),
      logoUrl: sub.field('logo.asset').field(
        '_ref',
        z
          .string()
          .nullish()
          .transform((assetId) =>
            urlFor(assetId, { width: 1000, height: 1000 })
          )
      ),
      rulesetId: z.string().nullish(),
      themeId: z.string().nullish(),
    }))

  return runQuery(query).then((tournaments) =>
    tournaments.map(
      (item) =>
        ({
          id: item._id,
          name: item.name ?? '(未命名的聯賽)',
          image: {
            logo: item.logoUrl ? { default: { url: item.logoUrl } } : undefined,
          },
          rulesetId: item.rulesetId ?? 'hkleague-4p',
          themeId: item.themeId ?? 'default',
        }) satisfies V2Tournament
    )
  )
}

export const apiGetTournamentById = async (tournamentId: string) => {
  const query = q.star
    .filterByType('matchTournament')
    .filterBy(`_id == "${tournamentId}"`)
    .slice(0)
    .project((sub) => ({
      _id: z.string(),
      name: z.string().nullish(),
      logoUrl: sub.field('logo.asset').field(
        '_ref',
        z
          .string()
          .nullish()
          .transform((assetId) =>
            urlFor(assetId, { width: 1000, height: 1000 })
          )
      ),
      rulesetId: z.string().nullish(),
      themeId: z.string().nullish(),
      teams: sub.field('teams[]').project((team) => ({
        _key: z.string(),
        ref: team
          .field('ref')
          .deref()
          .project((teamRef) => ({
            _id: z.string(),
            name: z.string().nullish(),
            secondaryName: z.string().nullish(),
            thirdName: z.string().nullish(),
            preferredName: z.string().nullish(),
            squareLogoImage: teamRef.field('squareLogoImage.asset').field(
              '_ref',
              z
                .string()
                .nullish()
                .transform((assetId) =>
                  urlFor(assetId, { width: 1000, height: 1000 })
                )
            ),
            color: teamRef.field('color.hex', z.string().nullish()),
            introduction: z.string().nullish(),
          })),
        overrided: team
          .field('overrided')
          .project((teamOverrided) => ({
            name: z.string().nullish(),
            secondaryName: z.string().nullish(),
            thirdName: z.string().nullish(),
            preferredName: z.string().nullish(),
            squareLogoImageUrl: teamOverrided
              .field('squareLogoImage.asset')
              .field(
                '_ref',
                z
                  .string()
                  .nullish()
                  .transform((assetId) =>
                    urlFor(assetId, { width: 1000, height: 1000 })
                  )
              ),
            color: teamOverrided.field('color.hex', z.string().nullish()),
            introduction: z.string().nullish(),
          }))
          .nullable(true),

        players: team
          .field('players[]')
          .project((player) => ({
            _key: z.string(),
            ref: player
              .field('ref')
              .deref()
              .project((playerRef) => ({
                _id: z.string(),
                name: z.string().nullish(),
                nickname: z.string().nullish(),
                designation: z.string().nullish(),
                introduction: z.string().nullish(),
                portraitImage: playerRef.field('portraitImage.asset').field(
                  '_ref',
                  z
                    .string()
                    .nullish()
                    .transform((assetId) =>
                      urlFor(assetId, {
                        mode: 'cover',
                        width: 720,
                        height: 1000,
                      })
                    )
                ),
                portraitAltImage: playerRef
                  .field('portraitAltImage.asset')
                  .field(
                    '_ref',
                    z
                      .string()
                      .nullish()
                      .transform((assetId) =>
                        urlFor(assetId, {
                          mode: 'cover',
                          width: 720,
                          height: 1000,
                        })
                      )
                  ),
                fullBodyImage: playerRef.field('fullBodyImage.asset').field(
                  '_ref',
                  z
                    .string()
                    .nullish()
                    .transform((assetId) =>
                      urlFor(assetId, { mode: 'contain', height: 1200 })
                    )
                ),
                fullBodyAltImage: playerRef
                  .field('fullBodyAltImage.asset')
                  .field(
                    '_ref',
                    z
                      .string()
                      .nullish()
                      .transform((assetId) =>
                        urlFor(assetId, { mode: 'contain', height: 1200 })
                      )
                  ),
                riichiImage: playerRef.field('riichiImage.asset').field(
                  '_ref',
                  z
                    .string()
                    .nullish()
                    .transform((assetId) =>
                      urlFor(assetId, {
                        mode: 'cover',
                        width: 800,
                        height: 800,
                      })
                    )
                ),
                statistics: playerRef
                  .field('statistics[]')
                  .filter(`_key=="${tournamentId}"`)
                  .slice(0),
              })),
            overrided: player
              .field('overrided')
              .project((playerOverrided) => ({
                name: z.string().nullish(),
                nickname: z.string().nullish(),
                designation: z.string().nullish(),
                introduction: z.string().nullish(),
                portraitImage: playerOverrided
                  .field('portraitImage.asset')
                  .field(
                    '_ref',
                    z
                      .string()
                      .nullish()
                      .transform((assetId) =>
                        urlFor(assetId, {
                          mode: 'cover',
                          width: 720,
                          height: 1000,
                        })
                      )
                  ),
                portraitAltImage: playerOverrided
                  .field('portraitAltImage.asset')
                  .field(
                    '_ref',
                    z
                      .string()
                      .nullish()
                      .transform((assetId) =>
                        urlFor(assetId, {
                          mode: 'cover',
                          width: 720,
                          height: 1000,
                        })
                      )
                  ),
                fullBodyImage: playerOverrided
                  .field('fullBodyImage.asset')
                  .field(
                    '_ref',
                    z
                      .string()
                      .nullish()
                      .transform((assetId) =>
                        urlFor(assetId, { mode: 'contain', height: 1200 })
                      )
                  ),
                fullBodyAltImage: playerOverrided
                  .field('fullBodyAltImage.asset')
                  .field(
                    '_ref',
                    z
                      .string()
                      .nullish()
                      .transform((assetId) =>
                        urlFor(assetId, { mode: 'contain', height: 1200 })
                      )
                  ),
                riichiImage: playerOverrided.field('riichiImage.asset').field(
                  '_ref',
                  z
                    .string()
                    .nullish()
                    .transform((assetId) =>
                      urlFor(assetId, {
                        mode: 'cover',
                        width: 800,
                        height: 800,
                      })
                    )
                ),
              }))
              .nullable(true),
          }))
          .nullable(true),

        statistics: true,
      })),
    }))

  const result = await runQuery(query).then((fetchedTournament) => {
    if (!fetchedTournament) {
      return null
    }

    const tournament = {
      ...fetchedTournament,
      id: fetchedTournament._id,
      name: fetchedTournament.name ?? '(未命名的聯賽)',
      image: {
        logo: fetchedTournament.logoUrl
          ? { default: { url: fetchedTournament.logoUrl } }
          : undefined,
      },
      rulesetId: fetchedTournament.rulesetId ?? 'hkleague-4p',
      themeId: fetchedTournament.themeId ?? 'default',
      teams: (fetchedTournament.teams ?? []).map((team) => {
        const teamFinal = mergeObject(
          mergeObject({}, team.ref ?? {}),
          team.overrided ?? {}
        ) as NonNullable<(typeof team)['ref']>

        return {
          id: team.ref?._id ?? '',
          name: {
            official: {
              primary: teamFinal.name ?? '',
              secondary: teamFinal.secondaryName ?? '',
              third: teamFinal.thirdName ?? '',
            },
            display: {
              primary: teamFinal.preferredName ?? '',
              secondary: teamFinal.secondaryName ?? '',
              third: teamFinal.thirdName ?? '',
            },
          },
          color: {
            primary: teamFinal.color ?? '#FFFF00',
            secondary: teamFinal.color ?? '#FFFF00',
          },
          image: {
            logo: teamFinal.squareLogoImage
              ? {
                  default: {
                    url: teamFinal.squareLogoImage,
                  },
                }
              : undefined,
          },
          statistics: team.statistics,

          players: (team.players ?? []).map((player) => {
            const playerFinal = mergeObject(
              mergeObject({}, player.ref ?? {}),
              player.overrided ?? {}
            ) as NonNullable<(typeof player)['ref']>

            return {
              id: player.ref?._id ?? '',
              name: {
                official: {
                  primary: playerFinal.name ?? '',
                  third: playerFinal.nickname ?? '',
                },
                display: {
                  primary: playerFinal.name ?? '',
                  third: playerFinal.nickname ?? '',
                },
              },
              color: {
                primary: teamFinal.color ?? '#FFFF00',
                secondary: teamFinal.color ?? '#FFFF00',
              },
              image: {
                portrait: playerFinal.portraitImage
                  ? {
                      default: {
                        url: playerFinal.portraitImage,
                      },
                    }
                  : undefined,
                portraitAlt: playerFinal.portraitAltImage
                  ? {
                      default: {
                        url: playerFinal.portraitAltImage,
                      },
                    }
                  : undefined,
                fullBody: playerFinal.fullBodyImage
                  ? {
                      default: {
                        url: playerFinal.fullBodyImage,
                      },
                    }
                  : undefined,
                fullBodyAlt: playerFinal.fullBodyAltImage
                  ? {
                      default: {
                        url: playerFinal.fullBodyAltImage,
                      },
                    }
                  : undefined,
                riichi: playerFinal.riichiImage
                  ? {
                      default: {
                        url: playerFinal.riichiImage,
                      },
                    }
                  : undefined,
                logo: teamFinal.squareLogoImage
                  ? {
                      default: {
                        url: teamFinal.squareLogoImage,
                      },
                    }
                  : undefined,
              },
              statistics: playerFinal.statistics,
            }
          }),
        }
      }),
    } satisfies V2Tournament

    const teams = tournament.teams ?? []
    const teamsMap = teams.reduce(
      (map, obj) => ((map[obj.id] = obj), map),
      {} as Record<string, V2TournamentTeam>
    )

    const players = teams.map((team) => team.players).flat()
    const playersMap = players.reduce(
      (map, obj) => ((map[obj.id] = obj), map),
      {} as Record<string, V2MatchPlayer>
    )

    return { tournament, teams, teamsMap, players, playersMap }
  })

  if (!result) {
    throw new Error('Error: Tournament not found.')
  }

  return result
}

export const apiGetTournamentIdByMatchId = async (matchId: string) => {
  const query = q.star
    .filterByType('match')
    .filterRaw(`_id == "${matchId}"`)
    .slice(0)
    .project((sub) => ({
      tournamentId: sub.field('tournament').field('_ref'),
    }))

  const tournamentId = await runQuery(query).then((res) => res?.tournamentId)
  if (!tournamentId) {
    throw new Error('Cannot find tournament id')
  }

  return tournamentId
}

export const apiGetTournamentByMatchId = async (matchId: string) => {
  const tournamentId = await apiGetTournamentIdByMatchId(matchId)
  return apiGetTournamentById(tournamentId)
}
