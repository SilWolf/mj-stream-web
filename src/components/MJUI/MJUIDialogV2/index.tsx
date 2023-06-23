import React, { useCallback, useEffect, useRef } from 'react'

export type MJUIDialogV2Props = {
  open?: boolean
  title?: React.ReactNode
  children: React.ReactNode
  onClose: () => void
  hideCloseButton?: boolean
}

function MJUIDialogV2({
  open,
  title,
  children,
  onClose,
  hideCloseButton,
}: MJUIDialogV2Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (!dialogRef?.current) {
      return
    }

    if (open) {
      dialogRef.current.showModal()
      const { current } = dialogRef

      return () => {
        current.close()
      }
    }
  }, [open])

  const handleDialogClose = useCallback(() => {
    onClose?.()
  }, [onClose])

  return (
    <dialog ref={dialogRef} onClose={handleDialogClose}>
      <div className="flex mb-4">
        <div className="flex-1 items-center font-bold text-lg">{title}</div>
        {!hideCloseButton && (
          <div className="shrink-0">
            <button
              type="button"
              className="absolute top-4 right-4"
              onClick={handleDialogClose}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
      </div>
      {children}
    </dialog>
  )
}

export default MJUIDialogV2
