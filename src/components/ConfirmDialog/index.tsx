import React, { useCallback, useState } from 'react'

export type ConfirmDialogProps = {
  title: string
  content?: string
  okButtonText?: string
  cancelButtonText?: string
  onClickOk?: () => Promise<void>
  onClickCancel?: () => Promise<void>
}

export default function ConfirmDialog({
  title,
  content,
  okButtonText,
  cancelButtonText,
  onClickOk,
  onClickCancel,
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
    <main className="antialiased bg-gray-200 text-gray-900 font-sans overflow-x-hidden">
      <div className="absolute inset-0 px-4 min-h-screen md:flex md:items-center md:justify-center">
        <div className="bg-black opacity-25 w-full h-full absolute z-10 inset-0" />
        <div className="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
          <div className="md:flex items-center">
            <div className="rounded-full border border-gray-300 flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto">
              <i className="bx bx-error text-3xl" />
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
              <p className="font-bold">{title}</p>
              {content && (
                <p className="text-sm text-gray-700 mt-1">{content}</p>
              )}
            </div>
          </div>
          <div className="text-center md:text-right mt-4 md:flex md:justify-end">
            <button
              type="button"
              className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2"
              onClick={handleClickOk}
              disabled={loadingForOk}
            >
              {loadingForOk ? (
                <span className="material-symbols-outlined animate-spin leading-none">
                  horizontal_rule
                </span>
              ) : (
                okButtonText
              )}
            </button>
            <button
              type="button"
              className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4
          md:mt-0 md:order-1"
              onClick={onClickCancel}
              disabled={loadingForOk}
            >
              {cancelButtonText}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

ConfirmDialog.defaultProps = {
  content: '',
  okButtonText: '確定',
  cancelButtonText: '取消',
  onClickOk: () => {
    //
  },
  onClickCancel: () => {
    //
  },
}
