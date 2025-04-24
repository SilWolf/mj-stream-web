import * as zod from 'zod'

export const v2MatchPlayerSchema = zod.object({
  name: zod.object({
    primary: zod.string(),
    secondary: zod.string().optional(),
    third: zod.string().optional(),
  }),
  color: zod.object({
    primary: zod.string().regex(/^#[0-9A-F]{6}$/i, '顏色必須是 #ABCDEF 格式。'),
    secondary: zod
      .string()
      .regex(/^#[0-9A-F]{6}$/i, '顏色必須是 #ABCDEF 格式。')
      .optional(),
  }),
  image: zod.object({
    portrait: zod
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
})

export const v2MatchSchema = zod
  .object({
    schemaVersion: zod.string(),
    code: zod.string(),
    data: zod.object({
      name: zod.string({ required_error: '對局必須有名稱' }),
      remark: zod.string().optional(),
      players: zod.array(v2MatchPlayerSchema),
      rulesetRef: zod.string(),
    }),
    metadata: zod.object({
      createdAt: zod.string().datetime(),
      createdBy: zod.string().datetime(),
      updatedAt: zod.string().datetime(),
      updatedBy: zod.string().datetime(),
    }),
  })
  .required()

export type V2MatchPlayer = zod.infer<typeof v2MatchPlayerSchema>
export type V2Match = zod.infer<typeof v2MatchSchema>
