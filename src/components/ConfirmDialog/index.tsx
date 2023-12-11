import React, { useCallback, useState } from 'react'
import MJUIDialogV2, { MJUIDialogV2Props } from '../MJUI/MJUIDialogV2'
import MJUIButton from '../MJUI/MJUIButton'
import MJUILoading from '../MJUI/MJUILoading'

export type ConfirmDialogOptions = {
  title: string
  content?: string
  okButtonText?: string
  cancelButtonText?: string
  onClickOk?: () => Promise<void>
  onClickCancel?: () => Promise<void>
}

export type ConfirmDialogProps = MJUIDialogV2Props & {
  okButtonText?: string
  cancelButtonText?: string
  onClickOk?: () => Promise<void>
  onClickCancel?: () => Promise<void>
}

export default function ConfirmDialog({
  title,
  children,
  okButtonText = '確認',
  cancelButtonText = '取消',
  onClickOk,
  onClickCancel,
  ...dialogProps
}: ConfirmDialogProps) {
  const [loadingForOk, setLoadingForOk] = useState<boolean>(false)

  const handleClickOk = useCallback(() => {
    if (onClickOk) {
      setLoadingForOk(true)
      onClickOk().finally(() => {
        setLoadingForOk(false)
      })
    }
  }, [onClickOk])

  return (
    <MJUIDialogV2 title={title} {...dialogProps}>
      <div className="mb-4">{children}</div>
      <div className="flex gap-x-4">
        <div className="flex-1">
          <MJUIButton
            type="button"
            color="secondary"
            className="w-full"
            onClick={onClickCancel}
            disabled={loadingForOk}
          >
            {cancelButtonText}
          </MJUIButton>
        </div>
        <div className="flex-1">
          <MJUIButton
            type="button"
            color="danger"
            className="w-full"
            onClick={handleClickOk}
            disabled={loadingForOk}
          >
            {loadingForOk ? <MJUILoading /> : okButtonText}
          </MJUIButton>
        </div>
      </div>
    </MJUIDialogV2>
  )
}
