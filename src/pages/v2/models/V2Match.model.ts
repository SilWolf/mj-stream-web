import * as zod from 'zod'
import { playerSchema } from '../adapters/sanity/sanity.zod'

export const v2MatchPlayerSchema = zod.object({
  id: zod.string(),
  teamId: zod.string().optional(),
  name: zod.object({
    official: zod.object({
      primary: zod.string(),
      secondary: zod.string().optional(),
      third: zod.string().optional(),
    }),
    display: zod.object({
      primary: zod.string(),
      secondary: zod.string().optional(),
      third: zod.string().optional(),
    }),
  }),
  color: zod.object({
    primary: zod.string().regex(/^#[0-9A-F]{6}$/i, '顏色必須是 #ABCDEF 格式。'),
    secondary: zod
      .string()
      .regex(/^#[0-9A-F]{6}$/i, '顏色必須是 #ABCDEF 格式。'),
  }),
  image: zod.object({
    portrait: zod
      .object({
        default: zod.object({ url: zod.string().url('玩家圖片必須是URL。') }),
      })
      .optional(),
    portraitAlt: zod
      .object({
        default: zod.object({ url: zod.string().url('玩家圖片必須是URL。') }),
      })
      .optional(),
    fullBody: zod
      .object({
        default: zod.object({ url: zod.string().url('玩家圖片必須是URL。') }),
      })
      .optional(),
    fullBodyAlt: zod
      .object({
        default: zod.object({ url: zod.string().url('玩家圖片必須是URL。') }),
      })
      .optional(),
    riichi: zod
      .object({
        default: zod.object({ url: zod.string().url('玩家圖片必須是URL。') }),
      })
      .optional(),
    logo: zod
      .object({
        default: zod.object({ url: zod.string().url('玩家圖片必須是URL。') }),
      })
      .optional(),
  }),
  statistics: playerSchema.shape.statistics.unwrap().element.nullish(),
})

export const v2MatchSchema = zod
  .object({
    schemaVersion: zod.string(),
    code: zod.string(),
    data: zod.object({
      tournamentId: zod.string().nullish(),
      name: zod.object({
        official: zod.object({
          primary: zod.string(),
        }),
        display: zod
          .object({
            primary: zod.string(),
          })
          .nullish(),
      }),
      remark: zod.string().optional(),
      players: zod.array(v2MatchPlayerSchema),
      rulesetRef: zod.string(),
    }),
    metadata: zod.object({
      createdAt: zod.string().datetime(),
      updatedAt: zod.string().datetime(),
      databaseId: zod.string().optional(),
    }),
  })
  .required()

export type V2MatchPlayer = zod.infer<typeof v2MatchPlayerSchema>
export type V2Match = zod.infer<typeof v2MatchSchema>
