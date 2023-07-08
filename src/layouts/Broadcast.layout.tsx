import React, { HTMLAttributes } from 'react'

export default function BroadcastLayout({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`w-screen h-screen mx-auto flex flex-col gap-y-4 items-stretch p-10 ${className} overflow-hidden`}
      style={{
        background:
          'linear-gradient(transparent, transparent 73%, rgba(0, 0, 0, 0.35))',
      }}
      {...props}
    >
      {children}
    </div>
  )
}
