import React, { HTMLAttributes } from 'react'

export default function BroadcastLayout({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`w-[1920px] h-[1080px] mx-auto flex flex-col items-stretch p-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
