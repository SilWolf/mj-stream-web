import * as yup from 'yup'

export const v2MatchPlayerSchema = yup.object({
  name: yup
    .object({
      primary: yup.string().required(),
      secondary: yup.string(),
      third: yup.string(),
    })
    .required(),
  color: yup
    .object({
      primary: yup
        .string()
        .matches(/^#[0-9A-F]{6}$/i, '顏色必須是 #ABCDEF 格式。')
        .required(),
      secondary: yup
        .string()
        .matches(/^#[0-9A-F]{6}$/i, '顏色必須是 #ABCDEF 格式。'),
    })
    .required(),
  image: yup
    .object({
      portrait: yup
        .object({
          default: yup.object({ url: yup.string().url('玩家圖片必須是URL。') }),
        })
        .notRequired(),
      logo: yup
        .object({
          default: yup.object({ url: yup.string().url('Logo圖片必須是URL。') }),
          large: yup.object({ url: yup.string().url('Logo圖片必須是URL。') }),
        })
        .notRequired(),
    })
    .required(),
})

export const v2MatchSchema = yup
  .object({
    schemaVersion: yup.string().required(),
    code: yup.string().required(),
    data: yup
      .object({
        name: yup.string().required('對局必須有名稱'),
        remark: yup.string(),
        players: yup.array(v2MatchPlayerSchema).required(),
        rulesetRef: yup.string().required(),
      })
      .required(),
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

export type V2MatchPlayer = yup.InferType<typeof v2MatchPlayerSchema>
export type V2Match = yup.InferType<typeof v2MatchSchema>
