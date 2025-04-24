import { PropsWithChildren } from 'react'

export function Dialog({ id, children }: PropsWithChildren<{ id: string }>) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box max-w-3xl w-full">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>{children}</div>
      </div>
    </dialog>
  )
}

export function openDialog(id: string) {
  return (document.getElementById(id) as HTMLDialogElement)?.showModal()
}

export function closeDialog(id: string) {
  return (document.getElementById(id) as HTMLDialogElement)?.close()
}
