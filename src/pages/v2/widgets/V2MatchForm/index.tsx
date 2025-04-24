import InputColor from '@/components/v2/inputs/InputColor'
import { useCallback, useEffect, useMemo } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { getRandomId } from '@/utils/string.util'
import useAllRulesets from '../../hooks/useAllRulesets'
import useRuleset from '../../hooks/useRuleset'
import V2PlayerCard from '../V2PlayerCard'
import { V2Match } from '../../models/V2Match.model'

const positionNames = ['東家', '南家', '西家', '北家']

const formSchema = yup
  .object({
    name: yup.string().required('必須填寫對局名稱。'),
    rulesetId: yup.string().required('必須選擇其中一套規則。'),
    players: yup
      .array(
        yup.object({
          namePrimary: yup.string().required('玩家必須有名稱'),
          nameSecondary: yup.string(),
          nameThird: yup.string(),
          colorPrimary: yup
            .string()
            .matches(/^#[0-9A-F]{6}$/i, '顏色必須是 #ABCDEF 格式。')
            .required('玩家必須有主要顏色'),
          imagePortraitUrl: yup.string().url('玩家圖片必須是URL。'),
        })
      )
      .required(),
  })
  .required()

type FormProps = yup.InferType<typeof formSchema>

export default function V2MatchForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (newMatch: V2Match) => void
  defaultValues?: FormProps | undefined
}) {
  const { data: rulesets } = useAllRulesets()

  const {
    control,
    register,
    handleSubmit: handleRHFSubmit,
    reset,
    formState,
  } = useForm<FormProps>({
    resolver: yupResolver(formSchema),
    defaultValues,
  })

  const watchedRulesetId = useWatch({ name: 'rulesetId', control })
  const { data: watchedRuleset } = useRuleset(watchedRulesetId)

  const watchedPlayers = useWatch({ name: 'players', control })

  const handleClickSwap = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!watchedRuleset) {
        return
      }

      const leftIndex = parseInt(
        e.currentTarget.getAttribute('data-player-index') as string
      )
      if (typeof leftIndex !== 'number') {
        return
      }

      const rightIndex =
        (leftIndex + 1 + watchedRuleset.data.playerCount) %
        watchedRuleset.data.playerCount

      reset((prev) => {
        const newPlayers = [...prev.players]
        ;[newPlayers[leftIndex], newPlayers[rightIndex]] = [
          newPlayers[rightIndex],
          newPlayers[leftIndex],
        ]

        return {
          ...prev,
          players: newPlayers,
        }
      })
    },
    [reset, watchedRuleset]
  )

  const handleSubmit = useMemo(
    () =>
      handleRHFSubmit((values) => {
        onSubmit({
          schemaVersion: 'v20250403',
          code: getRandomId(),
          data: {
            name: values.name,
            remark: '',
            players: values.players.map((player) => ({
              name: {
                primary: player.namePrimary,
                secondary: player.nameSecondary,
                third: player.nameThird,
              },
              color: {
                primary: player.colorPrimary,
              },
              image: {
                portrait: {
                  default: {
                    url: player.imagePortraitUrl,
                  },
                },
              },
            })),
            rulesetRef: values.rulesetId,
          },
          metadata: {
            createdAt: new Date().toISOString(),
            createdBy: 'System',
            updatedAt: new Date().toISOString(),
            updatedBy: 'System',
          },
        } satisfies V2Match)
      }),
    [handleRHFSubmit, onSubmit]
  )

  const handleClickReset = useCallback(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="bg-base-200 input input-xl input-ghost w-full"
        placeholder="玩家名稱"
        {...register('name')}
      />

      <h4 className="mt-4">規則</h4>
      <fieldset className="fieldset">
        <select className="select" {...register('rulesetId')}>
          {rulesets.map((ruleset) => (
            <option value={ruleset.id}>{ruleset.metadata.name.display}</option>
          ))}
        </select>
        <p className="fieldset-label text-error">
          {formState.errors['rulesetId']?.message}
        </p>
      </fieldset>

      <div className="divider"></div>

      <h4>玩家</h4>
      <div className="flex gap-x-4">
        {new Array(watchedRuleset?.data.playerCount)
          .fill(undefined)
          .map((_, index) => (
            <div key={index} className="flex-1">
              <fieldset
                className="relative fieldset border-2 border-base-300 p-4 rounded-box"
                style={{
                  borderColor: watchedPlayers?.[index]?.colorPrimary,
                  backgroundColor: `${watchedPlayers?.[index]?.colorPrimary}20`,
                }}
              >
                <legend className="fieldset-legend">
                  {positionNames[index]}
                </legend>

                <label className="fieldset-label">名稱</label>
                <input
                  type="text"
                  className="input"
                  placeholder="玩家名稱"
                  {...register(`players.${index}.namePrimary`)}
                />
                <p className="fieldset-label text-error">
                  {
                    formState.errors['players']?.[index]?.['namePrimary']
                      ?.message
                  }
                </p>

                <label className="fieldset-label">稱號</label>
                <input
                  type="text"
                  className="input"
                  placeholder="玩家名稱"
                  {...register(`players.${index}.nameSecondary`)}
                />
                <p className="fieldset-label text-error">
                  {
                    formState.errors['players']?.[index]?.['nameSecondary']
                      ?.message
                  }
                </p>

                <label className="fieldset-label">暱稱</label>
                <input
                  type="text"
                  className="input"
                  placeholder="玩家名稱"
                  {...register(`players.${index}.nameThird`)}
                />
                <p className="fieldset-label text-error">
                  {formState.errors['players']?.[index]?.['nameThird']?.message}
                </p>

                <label className="fieldset-label">顏色</label>
                <Controller
                  control={control}
                  name={`players.${index}.colorPrimary`}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputColor
                      onChange={onChange} // send value to hook form
                      onBlur={onBlur} // notify when input is touched/blur
                      value={value}
                    />
                  )}
                />
                <p className="fieldset-label text-error">
                  {
                    formState.errors['players']?.[index]?.['colorPrimary']
                      ?.message
                  }
                </p>

                <label className="fieldset-label">圖片</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="https://....png"
                  {...register(`players.${index}.imagePortraitUrl`)}
                />
                <p className="fieldset-label text-error">
                  {
                    formState.errors['players']?.[index]?.['imagePortraitUrl']
                      ?.message
                  }
                </p>

                <div className="divider"></div>

                <label className="fieldset-label">預覽</label>
                {watchedPlayers?.[index] && (
                  <div key={index} className="w-full text-[48px]">
                    <V2PlayerCard
                      score={watchedRuleset?.data.startingPoint ?? 0}
                      player={{
                        name: {
                          primary: watchedPlayers[index].namePrimary!,
                          secondary: watchedPlayers[index].nameSecondary!,
                          third: watchedPlayers[index].nameThird!,
                        },
                        color: {
                          primary: watchedPlayers[index].colorPrimary!,
                        },
                        image: {
                          portrait: {
                            default: {
                              url: watchedPlayers[index].imagePortraitUrl!,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                )}

                <button
                  type="button"
                  className="z-10 absolute btn rounded-full -right-8 -top-4 shadow"
                  onClick={handleClickSwap}
                  data-player-index={index}
                >
                  <i className="bi bi-arrow-left-right"></i>
                </button>
              </fieldset>
            </div>
          ))}
      </div>
      <div className="text-center mt-8 space-x-8">
        <button
          type="button"
          onClick={handleClickReset}
          className="btn btn-lg btn-ghost"
        >
          重置
        </button>
        <button type="submit" className="btn btn-primary btn-lg">
          建立對局
        </button>
      </div>
    </form>
  )
}
