import React, { useMemo, InputHTMLAttributes } from 'react'
import { cva } from 'cva'

type MJUIInputForColorProps = InputHTMLAttributes<HTMLInputElement>

const input = cva([
  'block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
])

function MJUIInputForColor({
  className,
  ...baseProps
}: MJUIInputForColorProps) {
  const myClassName = useMemo(() => input({ className }), [className])

  return <input type="color" className={myClassName} {...baseProps} />
}

export default MJUIInputForColor
