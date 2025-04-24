import * as yup from 'yup'

export const v2MatchRoundSchema = yup
  .object({
    schemaVersion: yup.string().required(),
    matchId: yup.string().required(),
    code: yup.string().required(),
    initial: yup
      .object({
        roundCount: yup.number().required(),
        extendedRoundCount: yup.number().required(),
        jackpot: yup.number().required(),
        players: yup
          .array(
            yup.object({
              score: yup.number().required(),
            })
          )
          .required(),
      })
      .required(),
    progress: yup
      .object({
        doras: yup.array(yup.string().required()).notRequired(),
        players: yup
          .array(
            yup.object({
              waitingTiles: yup.array(yup.string().required()).notRequired(),
              predictedYakus: yup.string(),
              flag: yup.object({
                isRiichied: yup.boolean(),
                isRevealed: yup.boolean(),
                isYellowCarded: yup.boolean(),
                isRedCarded: yup.boolean(),
                isRonDisallowed: yup.boolean(),
                __placeholder: yup.boolean().required(),
              }),
            })
          )
          .required(),
      })
      .required(),
    result: yup
      .object({
        endingType: yup
          .string()
          .matches(/^(ron)|(tsumo)|(exhausted)|(hotfix)$/),
        winDetail: yup
          .object({
            yakus: yup.string().required(),
            condition: yup.string().required(),
          })
          .notRequired(),
        players: yup
          .array(
            yup.object({
              isWinner: yup.boolean(),
              isLoser: yup.boolean(),
              score: yup.number().required(),
              scoreChanges: yup.array(yup.number().required()).required(),
            })
          )
          .required(),
      })
      .notRequired(),
    metadata: yup
      .object({
        createdAt: yup.string().datetime().required(),
        createdBy: yup.string().datetime().required(),
        updatedAt: yup.string().datetime().required(),
        updatedBy: yup.string().datetime().required(),
      })
      .required(),
  })
  .required()

export type V2MatchRound = yup.InferType<typeof v2MatchRoundSchema>
