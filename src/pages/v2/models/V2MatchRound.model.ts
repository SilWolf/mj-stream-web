import * as zod from 'zod'

export const v2MatchRoundSchema = zod.object({
  schemaVersion: zod.string(),
  matchId: zod.string(),
  code: zod.string(),
  initial: zod.object({
    roundCount: zod.number(),
    extendedRoundCount: zod.number(),
    jackpot: zod.number(),
    players: zod.array(
      zod.object({
        score: zod.number(),
      })
    ),
  }),
  progress: zod.object({
    doras: zod.array(zod.string()).optional(),
    players: zod.array(
      zod.object({
        waitingTiles: zod.array(zod.string()).optional(),
        predictedYakus: zod.string(),
        flag: zod.object({
          isRiichied: zod.boolean().optional(),
          isRevealed: zod.boolean().optional(),
          isYellowCarded: zod.boolean().optional(),
          isRedCarded: zod.boolean().optional(),
          isRonDisallowed: zod.boolean().optional(),
          __placeholder: zod.boolean(),
        }),
      })
    ),
  }),
  result: zod
    .object({
      endingType: zod
        .string()
        .regex(/^(ron)|(tsumo)|(exhausted)|(hotfix)$/)
        .optional(),
      winDetail: zod
        .object({
          yakus: zod.string(),
          condition: zod.string(),
        })
        .partial(),
      players: zod.array(
        zod.object({
          isWinner: zod.boolean().optional(),
          isLoser: zod.boolean().optional(),
          score: zod.number(),
          scoreChanges: zod.array(zod.number()),
        })
      ),
    })
    .optional(),
  metadata: zod.object({
    createdAt: zod.string().datetime(),
    updatedAt: zod.string().datetime(),
  }),
})

export type V2MatchRound = zod.infer<typeof v2MatchRoundSchema>
