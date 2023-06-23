import React, { ButtonHTMLAttributes, useMemo } from 'react'
import { cva, VariantProps } from 'cva'

const button = cva(['font-semibold'], {
  variants: {
    variant: {
      contained: ['border', 'rounded'],
      text: [],
      icon: ['hover:bg-opacity-50 leading-4'],
    },
    color: {
      primary: [],
      secondary: [],
    },
    size: {
      small: ['text-sm'],
      medium: ['text-base'],
      large: ['text-md'],
      xlarge: ['text-2xl'],
    },
  },
  compoundVariants: [
    {
      variant: 'contained',
      size: 'small',
      className: 'py-1 px-2',
    },
    {
      variant: 'contained',
      size: 'medium',
      className: 'py-2 px-4',
    },
    {
      variant: 'contained',
      size: 'large',
      className: 'py-2 px-4',
    },
    {
      variant: 'contained',
      size: 'xlarge',
      className: 'py-4 px-4',
    },
    {
      color: 'primary',
      variant: 'contained',
      className: 'bg-teal-800 text-white border-transparent hover:bg-teal-700',
    },
    {
      color: 'secondary',
      variant: 'contained',
      className: 'bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
    },
    {
      color: 'primary',
      variant: 'text',
      className: 'text-teal-800 hover:text-teal-700',
    },
    {
      color: 'secondary',
      variant: 'text',
      className: 'text-gray-800 hover:text-gray-700',
    },
    {
      color: 'primary',
      variant: 'icon',
      className: 'text-teal-800 hover:text-teal-700 hover:bg-teal-100',
    },
    {
      color: 'secondary',
      variant: 'icon',
      className: 'text-gray-800 hover:text-gray-700 hover:bg-gray-100',
    },
    {
      color: 'primary',
      size: 'medium',
      className: 'uppercase',
    },
  ],
  defaultVariants: {
    color: 'primary',
    size: 'medium',
    variant: 'contained',
  },
})

type MJUIButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>

export default function MJUIButton({
  color,
  size,
  variant,
  className,
  ...props
}: MJUIButtonProps) {
  const myClassName = useMemo(
    () => button({ color, size, variant, className }),
    [color, size, variant, className]
  )

  // eslint-disable-next-line react/button-has-type
  return <button className={myClassName} {...props} />
}
