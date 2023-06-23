import React, { ButtonHTMLAttributes, useMemo } from 'react'
import { cva } from 'cva'

const button = cva(['font-semibold', 'border', 'rounded'], {
  variants: {
    variant: {
      primary: [
        'bg-teal-800',
        'text-white',
        'border-transparent',
        'hover:bg-teal-700',
      ],
      // **or**
      // primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
      secondary: [
        'bg-white',
        'text-gray-800',
        'border-gray-400',
        'hover:bg-gray-100',
      ],
    },
    size: {
      small: ['text-sm', 'py-1', 'px-2'],
      medium: ['text-base', 'py-2', 'px-4'],
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      size: 'medium',
      class: 'uppercase',
      // **or** if you're a React.js user, `className` may feel more consistent:
      // className: "uppercase"
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
})

type MJUIButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
  size?: 'medium' | 'small'
}

export default function MJUIButton({
  variant,
  size,
  className,
  ...props
}: MJUIButtonProps) {
  const myClassName = useMemo(
    () => button({ variant, size, className }),
    [variant, size, className]
  )

  // eslint-disable-next-line react/button-has-type
  return <button className={myClassName} {...props} />
}
