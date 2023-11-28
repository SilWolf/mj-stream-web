import React, { SelectHTMLAttributes, useCallback, useMemo } from 'react'

type MJUISelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  onChangeValue?: (newValue: string) => void
}

export default function MJUISelect({
  className,
  onChange,
  onChangeValue,
  ...props
}: MJUISelectProps) {
  const myClassName = useMemo(
    () =>
      `block w-full rounded-md border-0 px-1 py-[9px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${className}`,
    [className]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e)
      onChangeValue?.(e.currentTarget.value)
    },
    [onChange, onChangeValue]
  )

  return <select className={myClassName} onChange={handleChange} {...props} />
}
