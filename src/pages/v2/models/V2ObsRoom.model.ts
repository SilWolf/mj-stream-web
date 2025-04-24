import * as zod from 'zod'

export const V2ObsRoomSchema = zod.object({
  schemaVersion: zod.string(),
  orgId: zod.string(),
  name: zod.object({
    display: zod.string(),
  }),
  activeMatchId: zod.string().optional(),
  activeDetailMatchRoundId: zod.string().optional(),
  props: zod.object({
    isHidingHeader: zod.boolean().optional(),
    isHidingPlayers: zod.boolean().optional(),
    scoreDisplayMode: zod
      .string()
      .regex(/^(score)|(point)$/)
      .optional(),
    activeReviewMatchRoundId: zod.string().optional(),
    __placeholder: zod.boolean(),
  }),
})

export type V2ObsRoom = zod.infer<typeof V2ObsRoomSchema>
