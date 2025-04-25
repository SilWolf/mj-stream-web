import * as zod from 'zod'
import { v2MatchPlayerSchema } from './V2Match.model'

export const v2TournamentTeamSchema = v2MatchPlayerSchema.extend({
  players: zod.array(
    v2MatchPlayerSchema.extend({
      statistics: zod.unknown(),
    })
  ),
  statistics: zod.unknown(),
})

export const v2TournamentSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  image: zod.object({
    logo: zod
      .object({
        default: zod.object({ url: zod.string().url('玩家圖片必須是URL。') }),
      })
      .optional(),
  }),
  teams: zod.array(v2TournamentTeamSchema).optional(),
  rulesetId: zod.string(),
  themeId: zod.string(),
})

export type V2TournamentTeam = zod.infer<typeof v2TournamentTeamSchema>
export type V2Tournament = zod.infer<typeof v2TournamentSchema>
