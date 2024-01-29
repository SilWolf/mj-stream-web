import React, { HTMLAttributes } from 'react'

export default function BroadcastLayout({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`w-full h-full mx-auto py-8 ${className} overflow-hidden text-[4.8rem]`}
      style={{
        background:
          'linear-gradient(transparent, transparent 73%, rgba(0, 0, 0, 0.25))',
      }}
      {...props}
    >
      {children}
    </div>
  )
}
