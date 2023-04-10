import React, { HTMLAttributes, useCallback } from 'react'

type Props = HTMLAttributes<HTMLButtonElement> & {
  value: string | undefined
  question?: string
  placeholder?: string
  onEdit?: (newValue: string | undefined | null, e: React.MouseEvent) => void
  required?: boolean
  disabled?: boolean
}

function MJInlineEditDiv({
  value,
  question = '請輸入新的值：',
  placeholder = '(空)',
  onEdit,
  required,
  disabled,
  ...buttonProps
}: Props) {
  const handleClickEdit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onEdit) {
        const newValue = prompt(question, value)

        if (!required || newValue) {
          onEdit(newValue, e)
        }
      }
    },
    [onEdit, question, required, value]
  )

  if (disabled) {
    return (
      <div>
        {value || <span className="italic text-gray-400">{placeholder}</span>}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-x-1">
      <div>
        {value || <span className="italic text-gray-400">{placeholder}</span>}
      </div>
      <div>
        <button type="button" onClick={handleClickEdit} {...buttonProps}>
          <span className="material-symbols-outlined text-sm text-gray-600 underline decoration-dotted">
            edit
          </span>
        </button>
      </div>
    </div>
  )
}

export default MJInlineEditDiv
