import React, { ButtonHTMLAttributes, useMemo } from 'react'

export default function MJUIButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const myClassName = useMemo(() => {
    if (props.disabled) {
      return `text-white bg-gray-300 dark:bg-gray-300 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center ${className}`
    }

    return `text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ${className}`
  }, [className, props.disabled])

  // eslint-disable-next-line react/button-has-type
  return <button className={myClassName} {...props} />
}
