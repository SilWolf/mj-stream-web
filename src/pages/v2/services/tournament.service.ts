import { q, runQuery, urlFor } from '../adapters/sanity'
import * as z from 'zod'
import { V2Tournament } from '../models/V2Tournament.model'
import { mergeObject } from '@/utils/object.util'
import { getLightColorOfColor } from '@/utils/string.util'

export const apiGetTournaments = (): Promise<V2Tournament[]> => {
  const query = q.star
    .filterByType('matchTournament')
    .order('_createdAt desc')
    .slice(0, 10)
    .project((sub) => ({
      _id: z.string(),
      name: z.string().nullable(),
      logoUrl: sub.field('logo.asset').field(
        '_ref',
        z
          .string()
          .nullable()
          .transform((assetId) =>
            urlFor(assetId, { width: 1000, height: 1000 })
          )
      ),
      rulesetId: z.string().nullable(),
      themeId: z.string().nullable(),
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

export const apiGetTournamentById = (
  tournamentId: string
): Promise<V2Tournament | null> => {
  const query = q.star
    .filterByType('matchTournament')
    .filterBy(`_id == "${tournamentId}"`)
    .slice(0, 1)
    .project((sub) => ({
      _id: z.string(),
      name: z.string().nullable(),
      logoUrl: sub.field('logo.asset').field(
        '_ref',
        z
          .string()
          .nullable()
          .transform((assetId) =>
            urlFor(assetId, { width: 1000, height: 1000 })
          )
      ),
      rulesetId: z.string().nullable(),
      themeId: z.string().nullable(),
      teams: sub.field('teams[]').project((team) => ({
        _key: z.string(),
        ref: team
          .field('ref')
          .deref()
          .project((teamRef) => ({
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
                .transform((assetId) =>
                  urlFor(assetId, { width: 1000, height: 1000 })
                )
            ),
            color: teamRef.field('color.hex', z.string().nullable()),
            introduction: z.string().nullable(),
          })),
        overrided: team
          .field('overrided')
          .project((teamOverrided) => ({
            name: z.string().nullable(),
            secondaryName: z.string().nullable(),
            thirdName: z.string().nullable(),
            preferredName: z.string().nullable(),
            squareLogoImageUrl: teamOverrided
              .field('squareLogoImage.asset')
              .field(
                '_ref',
                z
                  .string()
                  .nullable()
                  .transform((assetId) =>
                    urlFor(assetId, { width: 1000, height: 1000 })
                  )
              ),
            color: teamOverrided.field('color.hex', z.string().nullable()),
            introduction: z.string().nullable(),
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
                name: z.string().nullable(),
                nickname: z.string().nullable(),
                designation: z.string().nullable(),
                introduction: z.string().nullable(),
                portraitImage: playerRef.field('portraitImage.asset').field(
                  '_ref',
                  z
                    .string()
                    .nullable()
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
                      .nullable()
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
                    .nullable()
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
                      .nullable()
                      .transform((assetId) =>
                        urlFor(assetId, { mode: 'contain', height: 1200 })
                      )
                  ),
                riichiImage: playerRef.field('riichiImage.asset').field(
                  '_ref',
                  z
                    .string()
                    .nullable()
                    .transform((assetId) =>
                      urlFor(assetId, {
                        mode: 'cover',
                        width: 800,
                        height: 800,
                      })
                    )
                ),
                statistics: playerRef.raw<unknown>(
                  `statistics[_key=="${tournamentId}"][0]`
                ),
              })),
            overrided: player.field('overrided').project((playerOverrided) => ({
              name: z.string().nullable(),
              nickname: z.string().nullable(),
              designation: z.string().nullable(),
              introduction: z.string().nullable(),
              portraitImage: playerOverrided.field('portraitImage.asset').field(
                '_ref',
                z
                  .string()
                  .nullable()
                  .transform((assetId) =>
                    urlFor(assetId, { mode: 'cover', width: 720, height: 1000 })
                  )
              ),
              portraitAltImage: playerOverrided
                .field('portraitAltImage.asset')
                .field(
                  '_ref',
                  z
                    .string()
                    .nullable()
                    .transform((assetId) =>
                      urlFor(assetId, {
                        mode: 'cover',
                        width: 720,
                        height: 1000,
                      })
                    )
                ),
              fullBodyImage: playerOverrided.field('fullBodyImage.asset').field(
                '_ref',
                z
                  .string()
                  .nullable()
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
                    .nullable()
                    .transform((assetId) =>
                      urlFor(assetId, { mode: 'contain', height: 1200 })
                    )
                ),
              riichiImage: playerOverrided.field('riichiImage.asset').field(
                '_ref',
                z
                  .string()
                  .nullable()
                  .transform((assetId) =>
                    urlFor(assetId, { mode: 'cover', width: 800, height: 800 })
                  )
              ),
            })),
          }))
          .nullable(true),

        statistics: true,
      })),
    }))

  return runQuery(query).then((tournaments) => {
    if (!tournaments[0]) {
      return null
    }

    return {
      ...tournaments[0],
      id: tournaments[0]._id,
      name: tournaments[0].name ?? '(未命名的聯賽)',
      image: {
        logo: tournaments[0].logoUrl
          ? { default: { url: tournaments[0].logoUrl } }
          : undefined,
      },
      rulesetId: tournaments[0].rulesetId ?? 'hkleague-4p',
      themeId: tournaments[0].themeId ?? 'default',
      teams: (tournaments[0].teams ?? []).map((team) => {
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
            secondary: getLightColorOfColor(teamFinal.color ?? '#FFFF00'),
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
                secondary: getLightColorOfColor(teamFinal.color ?? '#FFFF00'),
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
  })
}
