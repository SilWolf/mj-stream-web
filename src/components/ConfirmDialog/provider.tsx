import React, {
  useMemo,
  useState,
  createContext,
  useContext,
  useCallback,
  PropsWithChildren,
} from 'react'
import ConfirmDialog, { ConfirmDialogOptions } from '.'

type ConfirmDialogContextProps = {
  isShowConfirmDialog: boolean
  setIsShowConfirmDialog: React.Dispatch<React.SetStateAction<boolean>>
  confirmDialogOptions: ConfirmDialogOptions
  setConfirmDialogOptions: React.Dispatch<
    React.SetStateAction<ConfirmDialogOptions>
  >
}

const defaultContextValue: ConfirmDialogContextProps = {
  isShowConfirmDialog: false,
  setIsShowConfirmDialog: () => {
    //
  },
  confirmDialogOptions: {
    title: '警告',
  },
  setConfirmDialogOptions: () => {
    //
  },
}

const ConfirmDialogContext = createContext(defaultContextValue)

export default function ConfirmDialogProvider({
  children,
}: PropsWithChildren<unknown>) {
  const [isShowConfirmDialog, setIsShowConfirmDialog] = useState<boolean>(false)
  const [confirmDialogOptions, setConfirmDialogOptions] =
    useState<ConfirmDialogOptions>({ title: '警告' })

  const value = useMemo(
    () => ({
      isShowConfirmDialog,
      setIsShowConfirmDialog,
      confirmDialogOptions,
      setConfirmDialogOptions,
    }),
    [confirmDialogOptions, isShowConfirmDialog]
  )

  const handleCloseDialog = useCallback(() => {
    setIsShowConfirmDialog(false)
  }, [])

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}
      <ConfirmDialog
        open={isShowConfirmDialog}
        okButtonText={confirmDialogOptions.okButtonText}
        cancelButtonText={confirmDialogOptions.cancelButtonText}
        onClickOk={confirmDialogOptions.onClickOk}
        onClickCancel={confirmDialogOptions.onClickCancel}
        onClose={handleCloseDialog}
        {...confirmDialogOptions}
        hideCloseButton
      >
        {confirmDialogOptions.content}
      </ConfirmDialog>
    </ConfirmDialogContext.Provider>
  )
}

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext)
  const showConfirmDialog = useCallback(
    (options: ConfirmDialogOptions) => {
      const onClickOk = async () => {
        return (options.onClickOk ?? (async () => Promise.resolve()))().then(
          () => {
            context.setIsShowConfirmDialog(false)
          }
        )
      }

      const onClickCancel = async () => {
        return (
          options.onClickCancel ?? (async () => Promise.resolve())
        )().then(() => {
          context.setIsShowConfirmDialog(false)
        })
      }

      context.setConfirmDialogOptions({ ...options, onClickOk, onClickCancel })
      context.setIsShowConfirmDialog(true)
    },
    [context]
  )

  return { showConfirmDialog }
}
