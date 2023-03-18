import React, { useCallback } from 'react'

export type MJUIDialogProps = {
  open?: boolean
  title?: React.ReactNode
  children: React.ReactNode
  onClose?: () => void
}

export default function MJUIDialog({
  open,
  title,
  children,
  onClose,
}: MJUIDialogProps) {
  const handleClickClose = useCallback(() => {
    onClose?.()
  }, [onClose])

  if (!open) {
    return null
  }

  return (
    <main className="antialiased bg-gray-200 text-gray-900 font-sans overflow-x-hidden">
      <div className="absolute inset-0 px-4 min-h-screen md:flex md:items-center md:justify-center">
        <div className="bg-black opacity-25 w-full h-full absolute z-10 inset-0" />
        <div className="bg-white rounded-lg md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
          <div className="md:flex items-center">
            <div className="text-center md:text-left">
              <p className="font-bold mb-10">{title}</p>
              {children}
              {onClose && (
                <button
                  type="button"
                  className="absolute top-4 right-4"
                  onClick={handleClickClose}
                >
                  X
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

MJUIDialog.defaultProps = {
  open: false,
  title: '',
  onClose: () => {
    //
  },
}
