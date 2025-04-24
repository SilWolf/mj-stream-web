import * as yup from 'yup'

export const V2ObsRoomSchema = yup.object({
  schemaVersion: yup.string().required(),
  orgId: yup.string().required(),
  name: yup
    .object({
      display: yup.string().required(),
    })
    .required(),
  activeMatchId: yup.string(),
  activeDetailMatchRoundId: yup.string(),
  props: yup.object({
    isHidingHeader: yup.boolean(),
    isHidingPlayers: yup.boolean(),
    scoreDisplayMode: yup.string().matches(/^(score)|(point)$/),
    activeReviewMatchRoundId: yup.string(),
    __placeholder: yup.boolean().required(),
  }),
})

export type V2ObsRoom = yup.InferType<typeof V2ObsRoomSchema>
