import React, {
  useMemo,
  useState,
  createContext,
  useContext,
  useCallback,
  PropsWithChildren,
} from 'react'
import ConfirmDialog, { ConfirmDialogProps } from '.'

type ConfirmDialogContextProps = {
  isShowConfirmDialog: boolean
  setIsShowConfirmDialog: React.Dispatch<React.SetStateAction<boolean>>
  confirmDialogOptions: ConfirmDialogProps
  setConfirmDialogOptions: React.Dispatch<
    React.SetStateAction<ConfirmDialogProps>
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
    useState<ConfirmDialogProps>({ title: '警告' })

  const value = useMemo(
    () => ({
      isShowConfirmDialog,
      setIsShowConfirmDialog,
      confirmDialogOptions,
      setConfirmDialogOptions,
    }),
    [confirmDialogOptions, isShowConfirmDialog]
  )

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}

      {isShowConfirmDialog && <ConfirmDialog {...confirmDialogOptions} />}
    </ConfirmDialogContext.Provider>
  )
}

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext)
  const showConfirmDialog = useCallback(
    (options: ConfirmDialogProps) => {
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
