import React, { useMemo, InputHTMLAttributes } from 'react'
import { cva } from 'cva'

type MJUIInputProps = InputHTMLAttributes<HTMLInputElement>

const input = cva([
  'block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
])

function MJUIInput({ className, ...baseProps }: MJUIInputProps) {
  const myClassName = useMemo(() => input({ className }), [className])

  return <input className={myClassName} {...baseProps} />
}

export default MJUIInput
