import * as zod from 'zod'

export const v2RulesetSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  metadata: zod.object({
    name: zod.object({
      display: zod.string(),
    }),
    description: zod.string(),
  }),
  data: zod.object({
    playerCount: zod.number(),
    roundCount: zod.number(),
    startingPoint: zod.number(),
  }),
  winScoring: zod.array(
    zod.object({
      condition: zod.string(),
      name: zod.object({
        display: zod.string(),
      }),
      value: zod.object({
        dealerWin: zod.object({
          ron: zod.object({
            perWinner: zod.number(),
            perLoserAsDealer: zod.number(),
            perLoser: zod.number(),
          }),
          tsumo: zod.object({
            perWinner: zod.number(),
            perLoserAsDealer: zod.number(),
            perLoser: zod.number(),
          }),
        }),
        playerWin: zod.object({
          ron: zod.object({
            perWinner: zod.number(),
            perLoserAsDealer: zod.number(),
            perLoser: zod.number(),
          }),
          tsumo: zod.object({
            perWinner: zod.number(),
            perLoserAsDealer: zod.number(),
            perLoser: zod.number(),
          }),
        }),
      }),
    })
  ),
  exhaustScoring: zod.array(
    zod.object({
      winnerCount: zod.number(),
      value: zod.object({ perWinner: zod.number(), perLoser: zod.number() }),
    })
  ),
  extendRoundScoring: zod.object({
    ron: zod.object({
      perWinner: zod.number(),
      perLoserAsDealer: zod.number(),
      perLoser: zod.number(),
    }),
    tsumo: zod.object({
      perWinner: zod.number(),
      perLoserAsDealer: zod.number(),
      perLoser: zod.number(),
    }),
  }),
  yakus: zod.array(
    zod.object({
      systemName: zod.string(),
      displayName: zod.string(),
      data: zod.object({
        han: zod.number().optional(),
        hanWhenRevealed: zod.number().optional(),
        yakuman: zod.number().optional(),
        yakumanWhenRevealed: zod.number().optional(),
        fixedFu: zod.number().optional(),
      }),
    })
  ),
  doras: zod.array(
    zod.object({
      systemName: zod.string(),
      displayName: zod.string(),
    })
  ),
})

export type V2Ruleset = zod.infer<typeof v2RulesetSchema>
