import React, { ButtonHTMLAttributes, useMemo } from 'react'
import { cva, VariantProps } from 'cva'

const button = cva(['font-semibold'], {
  variants: {
    variant: {
      contained: ['border', 'rounded'],
      text: [],
      icon: ['hover:enabled:bg-opacity-50 leading-4'],
    },
    color: {
      primary: [],
      secondary: [],
      success: [],
      danger: [],
      inverted: [],
    },
    size: {
      small: ['text-sm'],
      medium: ['text-base'],
      large: ['text-md'],
      xlarge: ['text-2xl'],
    },
    disabled: {
      true: ['cursor-not-allowed opacity-30'],
    },
    loading: {
      true: ['cursor-wait opacity-30'],
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
      className:
        'bg-teal-800 text-white border-transparent hover:enabled:bg-teal-700',
    },
    {
      color: 'secondary',
      variant: 'contained',
      className:
        'bg-white text-gray-800 border-gray-400 hover:enabled:bg-gray-100',
    },
    {
      color: 'success',
      variant: 'contained',
      className:
        'bg-green-100 text-green-500 border-green-400 hover:enabled:bg-green-200',
    },
    {
      color: 'danger',
      variant: 'contained',
      className:
        'bg-red-100 text-red-500 border-red-400 hover:enabled:bg-red-200',
    },
    {
      color: 'primary',
      variant: 'text',
      className: 'text-teal-800 hover:enabled:text-teal-700',
    },
    {
      color: 'secondary',
      variant: 'text',
      className: 'text-gray-800 hover:enabled:text-gray-700',
    },
    {
      color: 'success',
      variant: 'text',
      className: 'text-green-800 hover:enabled:text-green-700',
    },
    {
      color: 'danger',
      variant: 'text',
      className: 'text-red-800 hover:enabled:text-red-700',
    },
    {
      color: 'inverted',
      variant: 'text',
      className: 'text-gray-100 hover:enabled:text-gray-0',
    },
    {
      color: 'primary',
      variant: 'icon',
      className:
        'text-teal-800 hover:enabled:text-teal-700 hover:enabled:bg-teal-100',
    },
    {
      color: 'secondary',
      variant: 'icon',
      className:
        'text-gray-800 hover:enabled:text-gray-700 hover:enabled:bg-gray-100',
    },
    {
      color: 'success',
      variant: 'icon',
      className:
        'text-green-800 hover:enabled:text-green-700 hover:enabled:bg-green-100',
    },
    {
      color: 'danger',
      variant: 'icon',
      className:
        'text-red-800 hover:enabled:text-red-700 hover:enabled:bg-red-100',
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
  VariantProps<typeof button> & {
    loading?: boolean
  }

export default function MJUIButton({
  color,
  size,
  variant,
  className,
  type = 'button',
  loading,
  ...props
}: MJUIButtonProps) {
  const myClassName = useMemo(
    () =>
      button({
        color,
        size,
        variant,
        disabled: props.disabled,
        loading,
        className,
      }),
    [color, size, variant, props.disabled, loading, className]
  )

  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={myClassName}
      disabled={props.disabled || loading}
      {...props}
    />
  )
}
