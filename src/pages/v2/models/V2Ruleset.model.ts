import * as yup from 'yup'

export const v2RulesetSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required(),
  metadata: yup.object({
    name: yup
      .object({
        display: yup.string().required(),
      })
      .required(),
    description: yup.string().required(),
  }),
  data: yup.object({
    playerCount: yup.number().required(),
    roundCount: yup.number().required(),
    startingPoint: yup.number().required(),
  }),
  winScoring: yup
    .array(
      yup.object({
        condition: yup.string().required(),
        name: yup
          .object({
            display: yup.string().required(),
          })
          .required(),
        value: yup.object({
          dealerWin: yup.object({
            ron: yup.object({
              perWinner: yup.number().required(),
              perLoserAsDealer: yup.number().required(),
              perLoser: yup.number().required(),
            }),
            tsumo: yup.object({
              perWinner: yup.number().required(),
              perLoserAsDealer: yup.number().required(),
              perLoser: yup.number().required(),
            }),
          }),
          playerWin: yup.object({
            ron: yup.object({
              perWinner: yup.number().required(),
              perLoserAsDealer: yup.number().required(),
              perLoser: yup.number().required(),
            }),
            tsumo: yup.object({
              perWinner: yup.number().required(),
              perLoserAsDealer: yup.number().required(),
              perLoser: yup.number().required(),
            }),
          }),
        }),
      })
    )
    .required(),
  exhaustScoring: yup
    .array(
      yup.object({
        winnerCount: yup.number().required(),
        value: yup
          .object({ perWinner: yup.number(), perLoser: yup.number() })
          .required(),
      })
    )
    .required(),
  extendRoundScoring: yup
    .object({
      ron: yup.object({
        perWinner: yup.number().required(),
        perLoserAsDealer: yup.number().required(),
        perLoser: yup.number().required(),
      }),
      tsumo: yup.object({
        perWinner: yup.number().required(),
        perLoserAsDealer: yup.number().required(),
        perLoser: yup.number().required(),
      }),
    })
    .required(),
  yakus: yup
    .array(
      yup.object({
        systemName: yup.string().required(),
        displayName: yup.string().required(),
        data: yup.object({
          han: yup.number(),
          hanWhenRevealed: yup.number(),
          yakuman: yup.number(),
          yakumanWhenRevealed: yup.number(),
          fixedFu: yup.number(),
        }),
      })
    )
    .required(),
  doras: yup
    .array(
      yup.object({
        systemName: yup.string().required(),
        displayName: yup.string().required(),
      })
    )
    .required(),
})

export type V2Ruleset = yup.InferType<typeof v2RulesetSchema>
