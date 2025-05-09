import * as zod from 'zod'

export const V2ObsRoomSchema = zod.object({
  /** Legace fields. Need to keep until fully upgrade to v2 **/
  matchId: zod.string(),
  tournamentId: zod.string().nullish(),
  activeSceneId: zod.string(),
  activeSceneProps: zod.record(zod.string(), zod.string().or(zod.number())),
  themeId: zod.string().nullish(),

  schemaVersion: zod.string(),
  displayProps: zod.object({
    isHidingHeader: zod.boolean().optional(),
    isHidingPlayers: zod.boolean().optional(),
    scoreDisplayMode: zod
      .string()
      .regex(/^(score)|(point)$/)
      .optional(),
    activeReviewMatchRoundId: zod.string().optional(),
    __placeholder: zod.boolean(),
  }),
  activeMatch: zod
    .object({
      id: zod.string(),
      props: zod.record(zod.string(), zod.unknown()),
    })
    .optional(),
  activeScene: zod
    .object({
      id: zod.string(),
      props: zod.record(zod.string(), zod.unknown()),
    })
    .optional(),
})

export type V2ObsRoom = zod.infer<typeof V2ObsRoomSchema>
