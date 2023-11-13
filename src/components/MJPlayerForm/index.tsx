import React, { useCallback, useEffect, useMemo, useState } from 'react'

import MJPlayerCardDiv from '@/components/MJPlayerCardDiv'
import MJUIFormGroup from '@/components/MJUI/MJUIFormGroup'
import MJUIInput from '@/components/MJUI/MJUIInput'
import MJUIInputForColor from '@/components/MJUI/MJUIInputForColor'

import { Controller, useForm } from 'react-hook-form'
import { Player } from '@/models'
import { useAsyncFn } from 'react-use'
import MJUIButton from '../MJUI/MJUIButton'

export type MJPlayerFormProps = {
  defaultValue?: Player
  onSubmit: (newPlayer: Player) => Promise<unknown>
}

const DEFAULT_PLAYER = {
  title: '',
  name: '新的玩家',
  color: '#FF0000',
  propicSrc: '',
}

function MJPlayerForm({ defaultValue, onSubmit }: MJPlayerFormProps) {
  const [previewPlayer, setPreviewPlayer] = useState<Player>(DEFAULT_PLAYER)
  const {
    reset,
    getValues,
    control: formControl,
    handleSubmit: rhfHandleSubmit,
  } = useForm<Player>({
    defaultValues: DEFAULT_PLAYER,
  })

  const [{ loading: isSubmitting }, onSubmitAsyncFn] = useAsyncFn(onSubmit, [
    onSubmit,
  ])
  const handleSubmit = useMemo(
    () =>
      rhfHandleSubmit((newValue) => {
        onSubmitAsyncFn(newValue)
      }),
    [onSubmitAsyncFn, rhfHandleSubmit]
  )

  const handleBlurForm = useCallback(() => {
    setPreviewPlayer(getValues())
  }, [getValues])

  useEffect(() => {
    reset(defaultValue ?? DEFAULT_PLAYER)
    setPreviewPlayer(defaultValue ?? DEFAULT_PLAYER)
  }, [defaultValue, reset])

  return (
    <form onSubmit={handleSubmit} onBlur={handleBlurForm} className="space-y-6">
      <MJUIFormGroup label="顏色（務必選能看清楚白字的深色）">
        <Controller
          name="color"
          control={formControl}
          render={({ field }) => <MJUIInputForColor {...field} />}
          disabled={isSubmitting}
        />
      </MJUIFormGroup>

      <MJUIFormGroup label="稱號">
        <Controller
          name="title"
          control={formControl}
          render={({ field }) => (
            <MJUIInput
              type="text"
              {...field}
              placeholder="例：天鳳鳳位、雀魂x段"
              disabled={isSubmitting}
            />
          )}
        />
      </MJUIFormGroup>

      <MJUIFormGroup className="mb-6" label="名字">
        <Controller
          name="name"
          control={formControl}
          rules={{ required: true }}
          render={({ field }) => <MJUIInput {...field} />}
          disabled={isSubmitting}
        />
      </MJUIFormGroup>

      <MJUIFormGroup className="mb-6" label="圖片URL (https://...)">
        <Controller
          name="propicSrc"
          control={formControl}
          render={({ field }) => (
            <MJUIInput
              type="url"
              placeholder="https://"
              {...field}
              disabled={isSubmitting}
            />
          )}
        />
        <p className="text-sm">
          建議大小 360px * 500px (18:25)、使用去背的 .png
        </p>
      </MJUIFormGroup>

      <div>
        <div className="mb-2">預覽</div>
        <div className="text-[4rem] p-4 bg-gray-800 text-white">
          <MJPlayerCardDiv
            player={previewPlayer}
            score={25000}
            waitingTiles={['5m', '6m', '7m']}
            isRiichi
            isEast
          />
        </div>
      </div>

      <div>
        <MJUIButton type="submit" loading={isSubmitting}>
          儲存
        </MJUIButton>
      </div>
    </form>
  )
}

export default MJPlayerForm
