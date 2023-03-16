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
      `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${className}`,
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
