import React, { useCallback, useEffect, useMemo } from 'react'

import MJPlayerCardDiv from '@/components/MJPlayerCardDiv'
import MJUIFormGroup from '@/components/MJUI/MJUIFormGroup'
import MJUIInput from '@/components/MJUI/MJUIInput'
import MJUIInputForColor from '@/components/MJUI/MJUIInputForColor'

import { Controller, useForm, useWatch } from 'react-hook-form'
import { Player } from '@/models'
import { useAsyncFn } from 'react-use'
import MJUIButton from '../MJUI/MJUIButton'
import MJUIFileDropzone from '../MJUI/MJUIFileDropzone'
import { uploadImage } from '@/helpers/upload.helper'

export type MJPlayerFormProps = {
  defaultValue?: Player
  onSubmit: (newPlayer: Player) => Promise<unknown>
}

const DEFAULT_PLAYER = {
  title: '',
  name: '新的玩家',
  color: '#FF0000',
  proPicUrl: '',
}

function MJPlayerForm({ defaultValue, onSubmit }: MJPlayerFormProps) {
  const {
    reset,
    setValue,
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

  const previewPlayer = useWatch({ control: formControl })

  const handleChangeFileProPic = useCallback(
    (newFile: File) => {
      return uploadImage(newFile).then(({ url }) => {
        setValue('proPicUrl', url)
      })
    },
    [setValue]
  )

  const handleClickRemoveProPic = useCallback(() => {
    setValue('proPicUrl', null)
  }, [setValue])

  const handleChangeFileTeamPic = useCallback(
    (newFile: File) => {
      return uploadImage(newFile).then(({ url }) => {
        setValue('teamPicUrl', url)
      })
    },
    [setValue]
  )

  const handleClickRemoveTeamPic = useCallback(() => {
    setValue('teamPicUrl', null)
  }, [setValue])

  useEffect(() => {
    reset(defaultValue ?? DEFAULT_PLAYER)
  }, [defaultValue, reset])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-x-6">
        <div className="shrink-0">
          <MJUIFormGroup label="顏色">
            <Controller
              name="color"
              control={formControl}
              render={({ field }) => <MJUIInputForColor {...field} />}
              disabled={isSubmitting}
            />
          </MJUIFormGroup>
        </div>
        <div className="flex-1 space-y-6">
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

          <div className="grid grid-cols-2 gap-x-6">
            <MJUIFormGroup
              className="mb-6"
              label="玩家圖片"
              action={
                previewPlayer.proPicUrl && (
                  <a
                    href="#"
                    className="text-xs underline text-teal-800"
                    onClick={handleClickRemoveProPic}
                  >
                    移除
                  </a>
                )
              }
            >
              <MJUIFileDropzone
                helperText="建議大小 360px * 500px (18:25)"
                onChangeFile={handleChangeFileProPic}
              >
                {previewPlayer.proPicUrl && (
                  <img
                    className="aspect-[18/25]"
                    src={previewPlayer.proPicUrl}
                  />
                )}
              </MJUIFileDropzone>
            </MJUIFormGroup>

            <MJUIFormGroup
              className="mb-6"
              label="隊伍圖片"
              action={
                previewPlayer.teamPicUrl && (
                  <a
                    href="#"
                    className="text-xs underline text-teal-800"
                    onClick={handleClickRemoveTeamPic}
                  >
                    移除
                  </a>
                )
              }
            >
              <MJUIFileDropzone
                helperText="建議大小 500px * 500px (1:1)"
                onChangeFile={handleChangeFileTeamPic}
              >
                {previewPlayer.teamPicUrl && (
                  <img
                    className="aspect-square"
                    src={previewPlayer.teamPicUrl}
                  />
                )}
              </MJUIFileDropzone>
            </MJUIFormGroup>
          </div>
        </div>
      </div>

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
